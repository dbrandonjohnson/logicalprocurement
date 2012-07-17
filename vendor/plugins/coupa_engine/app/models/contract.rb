# Copyright (C) 2007  Coupa Software Incorporated http://www.coupa.com
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

class Contract < ActiveRecord::Base
  attr_protected :status
  
  acts_as_state_machine :column => :status, :initial => :draft
  state :draft
  state :published, :enter => Proc.new { |c| c.replaces.destroy if c.replaces }
  
  event :publish do
    transitions :to => :published, :from => :draft, :guard => Proc.new { |c| c.valid? and c.migrate_catalog and c.load_catalog }
  end
  
  file_column :catalog, :fix_file_extensions => false
  file_column :legal_agreement, :fix_file_extensions => false
  
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'

  belongs_to :supplier, :conditions => ['suppliers.status = \'active\'']
  belongs_to :currency
  belongs_to :bill_to_address, :class_name => "Address", :foreign_key => "bill_to_address_id"
    
  include Attachable
  
  has_many :catalog_items, :dependent => :destroy
  
  has_one :punchout_site
  
  validates_presence_of :name, :number, :supplier, :start_date, :end_date, :status
  validates_uniqueness_of :number, :scope => :status
  validates_numericality_of :number, :allow_nil => true
  validates_format_of :catalog, :with => /\.cif$/, :message => "must be a .cif file", :allow_nil => true
  validates_each :name, :number do |record, attribute, value|
    record.errors.add attribute, "is taken for this period" if Contract.find(:first, :conditions => ["id not in (?, ?) and #{attribute} = ? and start_date < ? and end_date > ?", record.id, record.replaces ? record.replaces.id : record.id, value, record.end_date, record.start_date])
  end
  
  def save(perform_validation=true)
    super(perform_validation && !draft?)
  end

  def has_draft?
    published? ? !Contract.find_by_status_and_number('draft', self.number).nil? : false
  end

  def clone
    new_contract = super
    new_contract.status = 'draft'
    new_contract.legal_agreement = File.new(self.legal_agreement) if self.legal_agreement
    new_contract[:catalog] = nil
    self.attachments.each { |attachment| new_contract.attachment_links.build :attachment => attachment.clone }
    return new_contract
  end

  def to_s
    name
  end
  
  def replaces
    Contract.find_by_status_and_number('published', self.number) if draft?
  end
  
  def catalog_data_source
    DataSource.find_by_owner_type_and_owner_id_and_source_for(self.class.name, self.id, 'CatalogItem', :order => 'created_at desc')
  end
  
  def load_catalog
    return true if self.catalog.nil?
    
    unless self.catalog.match(/\.cif$/)
      errors.add 'catalog', 'must be a CIF file'
      return false
    end
    
    @data_source = DataFileSource.new(:file => File.open(self.catalog))
    @data_source.source_for = 'CatalogItem'
    @data_source.owner = self
    unless @data_source.save
      logger.error("Catalog load error (contract_id=#{self.id}):")
      @data_source.errors.each_full { |msg| logger.error(msg) }
      errors.add 'catalog', 'could not be loaded: Cannot create loader job for catalog file'
      return false
    end
    
    begin
      job_key = MiddleMan.new_worker(:class => :cif_item_loader_worker, :args => @data_source.id)
      @data_source.update_attributes(:job_key => job_key)
    rescue ActiveRecord::StaleObjectError
      @data_source.reload
      @data_source.update_attributes(:job_key => job_key)
    rescue
      logger.error($!)
      errors.add 'catalog', 'could not be loaded: Cannot connect to the background processor.'
      return false
    end
    
    return true
  end
  
  def migrate_catalog
    return true unless old_contract = replaces
    old_contract.catalog_items.each do |i|
      catalog_items << i unless catalog_items.find_by_source_part_num_and_uom_id(i.source_part_num, i.uom_id)
    end
  end
end
