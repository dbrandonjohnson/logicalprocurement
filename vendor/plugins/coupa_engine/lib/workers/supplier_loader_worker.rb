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

require 'csv'

class SupplierLoaderWorker < BackgrounDRb::Rails
  def do_work(args)
    if args.is_a?(Hash)
      User.current_user = User.find_by_id(args[:user])
      data_source = DataFileSource.find(args[:data])
    else
      data_source = DataFileSource.find(args)
    end
    begin
      data_source.load!
    rescue ActiveRecord::StaleObjectError
      @logger.debug("Record stale!")
      data_source.reload
      data_source.load!
    end
    line_count = File.readlines(data_source.file()).size
    @logger.debug("Loaded #{line_count} lines from #{data_source.file()}")
    reader = CSV::Reader.create(File.new(data_source.file()))
    header = reader.shift
    error_csv = ""
    i = 0.0
    begin
      reader.each do |row| 
        @logger.debug("Beginning row #{i+1}")
        begin
          supplier_data = {}
          contact_data = {}
          address_data = {}
          supplier = nil
          row_action = ''
          row.each_with_index { |cell, j| 
            case header[j].to_s.strip.gsub('*','')
              when /Action/
                 row_action = cell.to_s.strip.downcase
              when /Primary Contact.+/
                contact_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/Primary Contact /,'').gsub(/ /,'_').downcase] = cell.to_s.strip
              when /Primary Address.+/
                address_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/Primary Address /,'').gsub(/ /,'_').downcase] = cell.to_s.strip
              else
                supplier_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/ /,'_').downcase] = cell.to_s.strip
            end
          }
          @logger.debug(row_action)
          @logger.debug(supplier_data.inspect)
          @logger.debug(contact_data.inspect)
          if supplier_data['parent_id'].to_s.empty? && !supplier_data['parent_name'].to_s.empty?
            supplier_data['parent_id'] = Supplier.find_by_name(supplier_data['parent_name']).id
          end
          supplier_data.delete('parent_name')
          supplier_data.delete('errors')
          if supplier_data['id'].to_s.empty? && row_action.downcase == 'add'
            supplier_data.delete('id')
            supplier = Supplier.new(supplier_data)
            #supplier.save
          elsif row_action.downcase == 'update'
            begin
              supplier = Supplier.find(supplier_data['id'])
              supplier.attributes= supplier_data
            rescue
              supplier = Supplier.new()
              supplier.errors.add_to_base('Supplier not found - valid ID required for update')
            end
          else
            supplier = Supplier.new()
            supplier.errors.add_to_base('Action unspecified or invalid.')
          end
          if contact_data['id'].to_s.empty?
            contact_data.delete('id')
            contact_data['name_fullname'] = ''
            supplier.build_primary_contact(contact_data)
          else
            begin
              supplier.primary_contact = Contact.find(contact_data['id'])
              supplier.primary_contact.attributes= contact_data
            rescue
              supplier.errors.add_to_base('Primary contact not found')
              supplier.primary_contact = Contact.new()
            end
          end
          if address_data['id'].to_s.empty?
            address_data.delete('id')
            if address_data['country_id'].to_s.empty?
              begin
                address_data['country_id'] = Country.find_by_name(address_data['country_name']).id unless address_data['country_name'].to_s.empty?
                address_data['country_id'] = Country.find_by_code(address_data['country_code']).id unless address_data['country_code'].to_s.empty?
              rescue
                supplier.errors.add_to_base('Country not found')
              end
            end
            address_data.delete('country_name')
            address_data.delete('country_code')
            supplier.build_primary_address(address_data)
          else
            begin
              supplier.primary_address = Address.find(address_data['id'],:conditions => ['address_owner_type = \'Supplier\' AND address_owner_id = '])
              supplier.primary_address.attributes= address_data
            rescue
              supplier.errors.add_to_base('Primary address not found')
              supplier.primary_address = Address.new()
            end
          end
          #supplier.attributes = supplier_data
          supplier.po_method = 'email' if supplier.po_method.blank?
          supplier.invoice_matching_level = '2-way' if supplier.invoice_matching_level.blank?
          @logger.warn("attrib is #{supplier.attributes['po_method']} blank is #{supplier.attributes['po_method'].blank?}")
          if supplier.errors.size > 0 || !supplier.save
            error_csv += CSV.generate_line(row << "#{[supplier.errors.full_messages.join(','),supplier.primary_contact.errors.full_messages.join(','),supplier.primary_address.errors.full_messages.join(',')].join(',')}") + "\n"
            @logger.debug("Supplier errors: #{supplier.errors.full_messages.join(',')}")
            @logger.debug("Contact errors: #{supplier.primary_contact.errors.full_messages.join(',')}")
            @logger.debug("Address errors: #{supplier.primary_address.errors.full_messages.join(',')}")
          else
            supplier.publish!
            @logger.debug("Created supplier '#{supplier.name}'")
            #supplier.primary_address.update_attribute(:address_owner,supplier)
          end
        rescue
          @logger.debug("Error:#{$!}")
        end
        i += 1.0
        @progress = (i / (line_count - 1)) * 100
      end
    ensure
      data_source.reload
      unless error_csv.empty?
        error_csv = CSV.generate_line(header << "Errors")+"\n"+error_csv
        data_source.update_attribute(:error_text,error_csv)
      end
      data_source.finish!
    end
    @logger.debug("Finished loading #{data_source.file()}.")
    @logger.debug("error_csv:#{error_csv}")
  end

  def progress
    @logger.debug "#{self.object_id} : progress = #{@progress}"
    @progress
  end
end
