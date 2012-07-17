class AddReceiving < ActiveRecord::Migration
  def self.up
    create_table "receipts" do |t|
      t.column "receivable_id", :integer
      t.column "receivable_type", :string
      t.column "receipt_date", :datetime
      t.column "quantity", :float
      t.column "amount", :float
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end
  end
  
  def self.down
    drop_table "receipts"
  end
end