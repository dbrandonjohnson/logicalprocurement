class AddInvoiceLineStatus < ActiveRecord::Migration
  def self.up
    add_column :invoice_lines, :status, :string
  end
  
  def self.down
    remove_column :invoice_lines, :status
  end
end