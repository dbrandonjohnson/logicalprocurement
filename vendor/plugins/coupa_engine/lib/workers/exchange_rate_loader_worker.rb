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

class ExchangeRateLoaderWorker < BackgrounDRb::Rails
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
          exchange_rate = nil
          exchange_rate_data = {}
          row_action = ''
          row.each_with_index { |cell, j| 
            case header[j].to_s.strip.gsub('*','')
              when /Action/
                 row_action = cell.to_s.strip.downcase
              else
                exchange_rate_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/ /,'_').downcase] = cell.to_s.strip
            end
          }
          if exchange_rate_data['from_currency_id'].to_s.empty? && !exchange_rate_data['from_currency'].to_s.empty?
            exchange_rate_data['from_currency_id'] = Currency.find_by_code(exchange_rate_data['from_currency']).id
          end
          if exchange_rate_data['to_currency_id'].to_s.empty? && !exchange_rate_data['to_currency'].to_s.empty?
            exchange_rate_data['to_currency_id'] = Currency.find_by_code(exchange_rate_data['to_currency']).id
          end
          exchange_rate_data.delete('period')
          exchange_rate_data.delete('from_currency')
          exchange_rate_data.delete('to_currency')
          exchange_rate_data.delete('errors')

          exchange_rate_data['rate_date'] ||= Time.today

          if exchange_rate_data['id'].to_s.empty? && row_action.downcase == 'add'
            exchange_rate_data.delete('id')
            exchange_rate = ExchangeRate.create(exchange_rate_data)
          elsif row_action.downcase == 'update'
            exchange_rate = ExchangeRate.find(exchange_rate_data['id'])
            if exchange_rate
              exchange_rate.update_attributes(exchange_rate_data)
            else
              exchange_rate = ExchangeRate.new()
              exchange_rate.errors.add(:id,'ID required for update.')
            end
          else
            exchange_rate = ExchangeRate.new()
            exchange_rate.errors.add(:id,'Action unspecified or invalid.')
          end
          if exchange_rate.errors && exchange_rate.errors.size > 0
            error_csv += CSV.generate_line(row << exchange_rate.errors.full_messages.join(','))+"\n"
          else
            @logger.debug("Created exchange rate '#{exchange_rate.from_currency.code} #{exchange_rate.to_currency.code}'")
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
