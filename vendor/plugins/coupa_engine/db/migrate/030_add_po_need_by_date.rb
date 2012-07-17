class AddPoNeedByDate < ActiveRecord::Migration
  def self.up
    add_column :order_lines, :need_by_date, :datetime
  end
  
  def self.down
    remove_column :order_lines, :need_by_date
  end
end