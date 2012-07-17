class AddPoAcknowledgement < ActiveRecord::Migration
  def self.up
    add_column :order_headers, :acknowledged_flag, :boolean
    remove_column :contracts, :discount
  end
  
  def self.down
    remove_column :order_headers, :acknowledged_flag
    add_column :contracts, :discount, :float
  end
end