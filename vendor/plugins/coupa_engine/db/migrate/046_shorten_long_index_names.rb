class ShortenLongIndexNames < ActiveRecord::Migration
  def self.up
    remove_index :catalog_items, :name => :catalog_items_source_part_num_index
    add_index :catalog_items, [:source_part_num], :name => "catalog_items_spn_index"
  end
  
  def self.down    
    remove_index :catalog_items, :name => :catalog_items_spn_index
    add_index :catalog_items, [:source_part_num], :name => "catalog_items_source_part_num_index"
  end
end