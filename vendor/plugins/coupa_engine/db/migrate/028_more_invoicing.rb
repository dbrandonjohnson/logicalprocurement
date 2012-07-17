class MoreInvoicing < ActiveRecord::Migration
  def self.up
    drop_table :invoice_distributions
    add_column :invoice_lines, :order_line_id, :integer
    remove_column :contracts, :invoice_matching_level
  end
  
  def self.down
    create_table "invoice_distributions" do |t|
      t.column "invoice_line_id", :integer
      t.column "order_line_id", :integer
      t.column "uom_id", :integer
      t.column "quantity", :float
      t.column "price", :float
      t.column "total", :float
      t.column "currency_id", :integer
      t.column "accounting_total", :float
      t.column "accounting_total_currency_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end
    remove_column :invoice_lines, :order_line_id
    add_column :contracts, :invoice_matching_level, :string
    Contract.find_all.each do |con|
      con.update_attribute(:invoice_matching_level,'2-way')
    end
  end
end