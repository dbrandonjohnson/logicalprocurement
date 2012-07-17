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

namespace :db do
  require 'active_record'
  require 'active_record/fixtures'

  namespace :seed do
    desc "Load seed data into the current environment's database. Load specific seeds using SEEDS=x,y. Load from a different directory using SRC=z"
    task :load => :environment do
      path = ENV['SRC'] || File.join(RAILS_ROOT, 'db', 'seed')
      ActiveRecord::Base.establish_connection(RAILS_ENV.to_sym)
      (ENV['SEEDS'] ? ENV['SEEDS'].split(/,/) : Dir.glob(File.join(path, '*.{yml,csv}'))).each do |seed_file|
        Fixtures.create_fixtures(path, File.basename(seed_file, '.*'))
      end
    end

    require 'yaml/encoding'
    desc "Dump seed data from the current environment's database. Dump specific seeds using SEEDS=x,y. Dump into different directory using DEST=z"
    task :dump => :environment do |task|
      path = ENV['DEST'] || File.join(RAILS_ROOT, 'db', 'seed')
      sql  = 'SELECT * FROM %s'

      ActiveRecord::Base.establish_connection(RAILS_ENV.to_sym)
      connection = ActiveRecord::Base.connection
      tables = ENV['SEEDS'] ? ENV['SEEDS'].split(',') : connection.tables.reject { |t| %w(schema_info sessions).include?(t) }
      tables.each do |table_name|
        i = '000'
        File.open("#{path}/#{table_name}.yml", 'wb') do |file|
          file.write ActiveRecord::Base.connection.select_all(sql % table_name).inject({}) { |hash, record|
            connection.columns(table_name).each do |column|
              record[column.name] = column.type_cast(record[column.name])

              # Deal with special cases like strings and bigdecimals
              if (k=column.name) && (v=record[k])
                if v.is_a?(String)
                  record[k] = YAML.escape(v)
                  # record[k].gsub!(/(\D):(\D)/, '\1":"\2') unless record[k].match(/^".*"$/)
                  record[k].gsub!('<%', '< %')
                end

                # Hack to work around BigDecimal not playing nice with YAML (see http://code.whytheluckystiff.net/syck/ticket/24)
                if v.is_a?(BigDecimal)                
                  record[k] = v.to_s
                end
              end
              
            end
            hash["#{table_name}_#{i.succ!}"] = record
            hash
          }.to_yaml
        end
      end
    end

    namespace :engines do
      desc "Load plugin/engine seed data into the current environment's database. Load specific seeds using SEEDS=x,y"
      task :load => :environment do
        ActiveRecord::Base.establish_connection(RAILS_ENV.to_sym)
        plugin = ENV['ENGINE'] || '*'
        (ENV['SEEDS'] ? ENV['SEEDS'].split(/,/).collect{ |s| Dir.glob(File.join(RAILS_ROOT, 'vendor', 'plugins', plugin, 'db', 'seed', s+'.{yml,csv}'))}.flatten : Dir.glob(File.join(RAILS_ROOT, 'vendor', 'plugins', plugin, 'db', 'seed', '*.{yml,csv}'))).each do |seed_file|
          Fixtures.create_fixtures(File.dirname(seed_file), File.basename(seed_file, '.*'))
        end
      end
    end
  end
end
