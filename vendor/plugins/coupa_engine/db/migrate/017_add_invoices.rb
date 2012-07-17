class AddInvoices < ActiveRecord::Migration
  def self.up
    create_table "invoice_headers" do |t|
      t.column "status", :string, :limit => 50
      t.column "supplier_id", :integer
      t.column "remit_to_address_id", :integer
      t.column "invoice_number", :string, :limit => 40
      t.column "invoice_date", :datetime
      t.column "terms_id", :integer
      t.column "supplier_note", :text
      t.column "internal_note", :text
      t.column "image_scan", :string, :limit => 255
      t.column "shipping_amount", :float
      t.column "handling_amount", :float
      t.column "tax_amount", :float
      t.column "misc_amount", :float
      t.column "currency_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end
    
    create_table "invoice_lines" do |t|
      t.column "invoice_header_id", :integer
      t.column "line_num", :integer
      t.column "type", :string, :limit => 100
      t.column "description", :string, :limit => 255
      t.column "catalog_item_id", :integer
      t.column "uom_id", :integer
      t.column "quantity", :float
      t.column "price", :float
      t.column "total", :float
      t.column "currency_id", :integer
      t.column "accounting_total", :float
      t.column "accounting_total_currency_id", :integer
      t.column "account_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

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
        
  end
  
  def self.down
    drop_table "invoice_headers"
    drop_table "invoice_lines"
    drop_table "invoice_distributions"
  end
end