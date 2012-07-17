class AddInvoiceMatching < ActiveRecord::Migration

  def self.up
    add_column :contracts, :invoice_matching_level, :string
    add_column :suppliers, :invoice_matching_level, :string
    Supplier.find_all.each do |supp|
      supp.update_attribute(:invoice_matching_level,'2-way')
    end
    Contract.find_all.each do |con|
      con.update_attribute(:invoice_matching_level,'2-way')
    end
  end
  
  def self.down
    remove_column :contracts, :invoice_matching_level
    remove_column :suppliers, :invoice_matching_level
  end
  
end