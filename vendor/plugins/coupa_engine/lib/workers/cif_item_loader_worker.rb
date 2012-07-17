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

require 'tempfile'
require 'open-uri'
# Put your code that runs your task inside the do_work method
# it will be run automatically in a thread. You have access to
# all of your rails models if you set load_rails to true in the
# config file. You also get @logger inside of this class by default.
class CifItemLoaderWorker < BackgrounDRb::Rails  
  def do_work(args)
    @progress = @items_total = @items_attempted = @items_loaded = 0
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
    @logger.debug("Reading CIF file.")
    begin
      catalog = CIF.new(File.new(data_source.owner.catalog, "r").read)
      if catalog.parse_error
        @error = "Error parsing CIF file: #{catalog.parse_error}"
        @logger.error(@error)
        return
      end
      if catalog.header[:CURRENCY].blank? || Currency.find_by_code(catalog.header[:CURRENCY]).nil?
        @error = "No currency defined in CIF file header."
        @logger.error(@error)
        return
      end
      @items_total = catalog.items.size
      @logger.debug("Finished parsing CIF file.  Creating #{@items_total} items...")
      catalog.items.each_with_index do |item,i|
        catalog_item = CatalogItem.find_or_create_by_contract_id_and_source_part_num_and_uom_id(data_source.owner.id, item["Supplier Part ID"], Uom.find_by_code(item["Unit of Measure"]).id)
        catalog_item.list_price_currency_id = Currency.find_by_code(catalog.header[:CURRENCY]).id
        catalog_item.list_price = Money.new(item["Unit Price"],catalog_item.list_price_currency_id)
        catalog_item.name = item["ShortName"]
        catalog_item.description = item["Item Description"]
        if item["Image"]
          # Attempt to retrieve the image and cache it locally
          begin
            uri = URI.parse(item["Image"])
            ti = Tempfile.new(Time.now.to_i.to_s)
            ti.binmode
            uri.open do |f|
              ti << f.read
              ti.close
            end
            catalog_item.image = ti.__getobj__()
            ti.delete
          rescue
            @logger.debug("Error capturing image:#{$!}")
          end
        end
        if catalog_item.save
          @items_loaded += 1
        else
          @logger.error("Error loading item ##{i+1}:")
          @logger.error(catalog_item.errors.full_messages.join("\n"))
        end
        @items_attempted += 1
        @progress = (((i.to_f+1.0) / catalog.items.length.to_f) * 100).round
        @logger.debug("Progress: #{@progress} i=#{i}, length=#{catalog.items.length}")
      end
    rescue
      @error = "Error loading CIF file: #{$!}"
      @logger.error("Error loading CIF file: #{$!}")
      @logger.error($!.backtrace.first(10).join("\n"))
    ensure
      data_source.reload
      data_source.finish!
    end
    @logger.debug("Finished loading #{data_source.file()}.")
  end

  def progress
    @logger.debug "#{self.object_id} : progress = #{@progress}"
    @progress
  end
  
  def status
    return @error if @error
    return "Loaded: #{@items_loaded}/#{@items_total} items" if @progress == 100
    return "Loading: #{@progress}%"
  end
end
