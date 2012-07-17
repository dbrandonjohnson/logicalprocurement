class AddAssetTracking < ActiveRecord::Migration
  def self.up
    add_column :asset_tags, :received, :boolean, :default => false
  end

  def self.down
    remove_column :asset_tags, :received
  end
end
