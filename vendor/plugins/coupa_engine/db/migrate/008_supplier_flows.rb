class SupplierFlows < ActiveRecord::Migration
  def self.up
    add_column "suppliers", "status", :string, :limit => 100
    Supplier.find(:all).each do |sup|
      sup.update_attribute(:status,'active')
    end
  end
  
  def self.down
    remove_column "suppliers", "status"
  end
end
