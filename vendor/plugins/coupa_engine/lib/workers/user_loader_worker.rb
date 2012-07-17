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

class UserLoaderWorker < BackgrounDRb::Rails
  def do_work(args)
    # Insure we have a valid current_user for UserStamp, if it's set
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
          user = nil
          user_data = {}
          address_data = {}
          bg_data = {}
          account_data = {}
          pcard_data = {}
          role_data = {}
          row_action = ''
          row.each_with_index { |cell, j| 
            case header[j].to_s.strip.gsub('*','')
              when /Action/
                 row_action = cell.to_s.strip.downcase
              when /Default Address.+/
                 address_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/Default Address /,'').gsub(/ /,'_').downcase] = cell.to_s.strip
              when /Business Group.+/
                 bg_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/Business Group /,'').gsub(/ /,'_').downcase] = cell.to_s.strip
              when /Default Account.+/
                 account_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/Default Account /,'').gsub(/ /,'_').downcase] = cell.to_s.strip
              when /Pcard.+/
                 pcard_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/Pcard /,'').gsub(/ /,'_').downcase] = cell.to_s.strip
              when /User Role.+/
                 role_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/User Role /,'').gsub(/ /,'_').downcase] = cell.to_s.strip
              else
                user_data[header[j].to_s.strip.gsub(/\*+/,'').gsub(/ /,'_').downcase] = cell.to_s.strip
            end
          }
          
          if user_data['approval_limit_id'].to_s.empty? && !user_data['approval_limit_amount'].to_s.empty?
            user_data['approval_limit_id'] = ApprovalLimit.find_by_amount(user_data['approval_limit_amount']).id
          end
          user_data.delete('approval_limit_amount')
          if user_data['manager_id'].to_s.empty? && !user_data['manager_login'].to_s.empty?
            user_data['manager_id'] = User.find_by_login(user_data['manager_login']).id
          end
          user_data.delete('manager_login')
          if !user_data['default_account_name'].to_s.empty?
            user_data['default_account_id'] = Account.find_by_name(user_data['default_account_name']).id
          end
          user_data.delete('default_account_name')

          if !user_data['default_currency'].to_s.empty?
            user_data['default_currency_id'] = Currency.find_by_code(user_data['default_currency']).id
          end
          user_data.delete('default_currency')
          user_data.delete('errors')
          
          User.transaction do
            if user_data['id'].to_s.empty? && row_action.downcase == 'add'
              user_data.delete('id')
              user = User.new(user_data)
              if user_data['password'] && !user_data['password'].empty?
                user.new_password = true
                user.verified = 1
                user.save
              else
                user.errors.add_to_base('New users require a password')
              end
            elsif row_action.downcase == 'update'
              user = User.find(user_data['id'])
              if user
                if user_data['password'] && !user_data['password'].empty?
                  user.change_password(user_data['password'])
                  user_data.delete('password')
                end
                case u = user_data.delete('status')
                  when 'active': user.enable! 
                  when 'inactive': user.disable! 
                  # enable by default
                  else
                    user.enable!
                end
                user.update_attributes(user_data)
              else
                user = User.new()
                user.errors.add('ID required for update.')
              end
            else
              user = User.new()
              user.errors.add('Action unspecified or invalid.')
            end

            if !user.errors || user.errors.empty?
              if account_data['type_id'].to_s.empty? && !account_data['type_name'].to_s.empty?
                account_data['type_id'] = AccountType.find_by_name(account_data['type_name']).id
              end
              
              associated_errors = []
              acct = nil
              if !account_data['code'].empty?
                user.default_account = Account.find_by_contents(account_data['code']).first
              end
              if !user.default_account && !account_data['code'].to_s.empty? && !account_data['type_id'].to_s.empty?
                new_account = {}
                new_account[:account_type_id] = account_data['type_id']
                new_account[:name] = account_data['name']
                # Create a new account with populated segments
                account_data['code'].gsub("\"", "").split('-').inject(1) { |index, segment| 
                #  account.send('segment_'+index.to_s+'=', segment) 
                  new_account[('segment_'+index.to_s).to_sym] = segment.to_s
                  index += 1
                }
                acct = Account.new(new_account)
                acct.save
                # If any errors on account, add em here
                acct.errors.each_full { |msg| 
                  associated_errors.push(msg)
                } 
                user.default_account = acct

  # Accounts don't need an account type
  #            elsif account_data['type_id'].to_s.empty?
  #              associated_errors.push('All accounts need an account type')
              end

              user.roles.clear
              if role_data['ids'].to_s.empty? && !role_data['names'].to_s.empty?
                role_data['names'].split(',').each { |role|
                  user.roles << Role.find_by_name(role.strip)
                }
              else
                role_data['ids'].split(',').each { |role|
                  user.roles << Role.find_by_id(role.strip.to_i)
                }
              end
            
              if address_data['id'].to_s.empty? 
                address_data['country_id'] = Country.find_by_name(address_data['country_name']).id unless address_data['country_name'].to_s.empty?
                address_data['country_id'] = Country.find_by_code(address_data['country_code']).id unless address_data['country_code'].to_s.empty?
                address_data.delete('country_name')
                address_data.delete('country_code')
                user.build_default_address(address_data)
              else
                user.default_address = Address.find(address_data['id'])
              end
      
              if !pcard_data.empty?
                if pcard_data['id'].to_s.empty?
                  user.build_pcard(pcard_data)
                else
                  user.pcard = Pcard.find(pcard_data['id'])
                end
              elsif user.pcard
                user.pcard.destroy 
              end

              if !bg_data.empty?
                user.business_group_assignments.clear
              if bg_data['ids'].to_s.empty? && !bg_data['names'].to_s.empty?
                bg_data['names'].split(',').each { |bg|
                  user.business_group_assignments.create(:securable => user, :business_group_id => BusinessGroup.find_by_name(bg.strip).id)
                }
              else
                bg_data['ids'].split(',').each { |bg|
                  user.business_group_assignments.create(:securable => user, :business_group_id => bg.strip.to_i)
                }
              end
            end
            user.save

            associated_errors.each { |err| user.errors.add_to_base(err) }
          end

          if user.errors && user.errors.size > 0
            error_csv += CSV.generate_line(row << user.errors.full_messages.join(','))+"\n"
          end
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
  end

  def progress
    @logger.debug "#{self.object_id} : progress = #{@progress}"
    @progress
  end
end
