class MoreReceiving < ActiveRecord::Migration
  def self.up
    add_column :order_lines, :type, :string, :limit => 100
    add_column :receipts, :type, :string, :limit => 100
    rename_column :receipts, :amount, :unit_price
    add_column :receipts, :total, :float
    add_column :receipts, :uom_id, :integer
    add_column :order_lines, :received, :float
    OrderLine.find(:all).each do |ol|
      if ol.quantity && ol.quantity > 0
        ol.update_attribute(:type,'OrderQuantityLine')
      else
        ol.update_attribute(:type,'OrderAmountLine')
      end
    end
  end
  
  def self.down
    remove_column :order_lines, :type
    remove_column :receipts, :type
    rename_column :receipts, :unit_price, :amount
    remove_column :receipts, :total
    remove_column :receipts, :uom_id
    remove_column :order_lines, :received
  end
end