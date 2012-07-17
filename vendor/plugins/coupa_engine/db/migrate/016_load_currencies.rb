require 'active_record/fixtures'
class LoadCurrencies < ActiveRecord::Migration
  def self.up
    Dir.glob(File.join(RAILS_ROOT, 'vendor', 'plugins', 'coupa_engine', 'db', 'seed', 'currencies.yml')).each do |seed_file|
      Fixtures.create_fixtures(File.dirname(seed_file), File.basename(seed_file, '.*'))
    end
  end
  
  def self.down
  end
end