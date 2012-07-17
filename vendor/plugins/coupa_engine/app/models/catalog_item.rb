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

class CatalogItem < ActiveRecord::Base
  include ActionView::Helpers::TextHelper
  
  has_many :product_reviews, :dependent => :destroy, :after_add => :evaluate_avg_rating_add, :before_remove => :evaluate_avg_rating_rmv, :order => 'created_at DESC'
  belongs_to :contract, :include => :supplier
  belongs_to :list_price_currency, :class_name => 'Currency'
  composed_of :list_price, :class_name => 'Money', :mapping => [%w(list_price amount),%w(list_price_currency_id currency_id)]
  belongs_to :uom
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  file_column :image
  acts_as_taggable
  acts_as_ferret :fields => { :name => { :boost => 2 }, :description => {}, :source_part_num => { :boost => 1.5 } }, :remote => true
  
  validates_presence_of :name, :uom_id
  validates_length_of :name, :in => 1..255   
  validates_numericality_of :list_price, :allow_nil => true

  before_validation :clean_fields

  def evaluate_avg_rating_add(review)
    self.update_attributes({:avg_rating => ((self.avg_rating * (self.product_reviews.size - 1)) + review.rating) / (self.product_reviews.size),:product_reviews_count => self.product_reviews_count(:refresh)})
    logger.debug "New avg_rating is #{self.avg_rating}"
  end
  
  def evaluate_avg_rating_rmv(review)
    if self.product_reviews.size == 1 then
      self.update_attributes({:avg_rating => 0,:product_reviews_count => self.product_reviews_count(:refresh)})
    else
      self.update_attributes({:avg_rating => ((self.avg_rating * self.product_reviews.size) - review.rating) / (self.product_reviews.size - 1),:product_reviews_count => self.product_reviews_count(:refresh)})
    end
    logger.debug "New avg_rating is #{self.avg_rating}"
  end
  
  def clean_fields
    self.name = sanitize(name) unless name.nil?
    self.description = sanitize(description) unless description.nil?
  end
end
