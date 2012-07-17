class AddPoVersions < ActiveRecord::Migration
  def self.up
    OrderHeader.create_versioned_table
    OrderLine.create_versioned_table
  end
  
  def self.down
    OrderLine.drop_versioned_table
    OrderHeader.drop_versioned_table
    
    remove_column "order_lines", "version"
    remove_column "order_headers", "version"
  end
end