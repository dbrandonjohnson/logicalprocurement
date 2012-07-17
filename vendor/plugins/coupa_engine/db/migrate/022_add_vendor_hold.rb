class AddVendorHold < ActiveRecord::Migration
  def self.up
    add_column :suppliers, :on_hold, :boolean
    add_column :data_sources, :parameters, :text
  end
  
  def self.down
    remove_column :suppliers, :on_hold
    remove_column :data_sources, :parameters
  end
end