class AddSupplierAcctNo < ActiveRecord::Migration
  def self.up
    add_column :suppliers, :account_number, :string
  end

  def self.down
    remove_column :suppliers, :account_number
  end
end
