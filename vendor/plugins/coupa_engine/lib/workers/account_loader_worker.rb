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

class AccountLoaderWorker < BackgrounDRb::Rails
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
          account = nil
          account_data = {}
          row_action = ''
          row.each_with_index { |cell, j| 
            case header[j].to_s.strip.gsub('*','')
              when /Action/
                 row_action = cell.to_s.strip.downcase
              else
                pc = cell.to_s.strip
                account_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/ /,'_').downcase] = pc.empty? ? nil : pc
            end
          }
          if account_data['account_type_id'].to_s.empty? && !account_data['account_type'].to_s.empty?
            account_data['account_type_id'] = AccountType.find_by_name(account_data['account_type']).id
          end
          account_data.delete('account_type')
          account_data.delete('errors')

          if account_data['id'].to_s.empty? && row_action.downcase == 'add'
            account_data.delete('id')
            account = Account.create(account_data)
          elsif row_action.downcase == 'update'
            account = Account.find(account_data['id'])
            if account
              account.update_attributes(account_data)
            else
              account = Account.new()
              account.errors.add('ID required for update.')
            end
          else
            account = Account.new()
            account.errors.add('Action unspecified or invalid.')
          end
          if account.errors && account.errors.size > 0
            error_csv += CSV.generate_line(row << account.errors.full_messages.join(','))+"\n"
          else
            @logger.debug("Created account '#{account.code}'")
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
