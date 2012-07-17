class OrderLineAccount < ActiveRecord::Migration
  def self.up
    unless OrderLine.columns.any? { |col| col.name == 'account_id' }
      add_column :order_lines, :account_id, :integer
    end
  end
  
  def self.down
    remove_column :order_lines, :account_id
  end
end