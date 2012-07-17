class InitializePoVersions < ActiveRecord::Migration
  def self.up
    [OrderHeader, OrderLine].each do |model|
      model.find(:all).each do |obj|
        obj.save if obj.versions.empty?
      end
    end
  end
  
  def self.down
  end
end