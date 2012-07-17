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

class CatalogItemLoaderWorker < BackgrounDRb::Rails
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
          item_data = {}
          row_action = ''
          row.each_with_index { |cell, j| 
            case header[j].to_s.strip.gsub('*','')
              when /Action/
                 row_action = cell.to_s.strip.downcase
              else
                pc = cell.to_s.strip
                item_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/ /,'_').downcase] = pc.empty? ? nil : pc
            end
          }
          item_data.delete('errors')

          currency_obj = Currency.find_by_code(item_data['list_price_currency_code'])
          currency = item_data['list_price_currency_id'] || (currency_obj ? currency_obj.id : nil)
          
          new_params = { :contract_id => item_data['contract_id'] || (item_data['contract_name'] ? Contract.find_by_name(item_data['contract_name']).id : nil),
                         :uom_id => item_data['uom_id'] || (item_data['uom_code'] ? Uom.find_by_code(item_data['uom_code']).id : nil),
                         :list_price_currency_id => currency,
                         :list_price => Money.new(item_data['list_price'],currency),
                       }.merge(item_data.without('contract_id','contract_name','uom_id','uom_code','list_price','list_price_currency_id','list_price_currency_code','image_url'))

          # Tempfile used for image
          ti = Tempfile.new(new_params["name"].to_s)
          if item_data["image_url"]
            # Attempt to retrieve the image and cache it locally
          begin
              uri = URI.parse(item_data["image_url"])
              ti.binmode
              uri.open do |f|
                ti << f.read
                ti.close
              end
              new_params['image'] = ti.__getobj__()
            rescue
              @logger.debug("Error capturing image:#{$!}")
            end
          end

          if item_data['id'].to_s.empty? && row_action.downcase == 'add'
            item_data.delete('id')
            item = CatalogItem.create(new_params)
          elsif row_action.downcase == 'update'
            item = CatalogItem.find(item_data['id'])
            if item
              item.update_attributes(new_params)
            else
              item = CatalogItem.new()
              item.errors.add('ID required for update.')
            end
          else
            item = CatalogItem.new()
            item.errors.add('Action unspecified or invalid.')
          end

          ti.delete

          if item.errors && item.errors.size > 0
            error_csv += CSV.generate_line(row << item.errors.full_messages.join(','))+"\n"
          else
            @logger.debug("Created item '#{item.name}'")
          end
        rescue
          error_csv += CSV.generate_line(row << $!)+"\n"          
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
