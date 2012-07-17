class AddPcard < ActiveRecord::Migration
  def self.up
    create_table :pcards do |t|
      t.column :name, :string
      t.column :number, :string
      t.column :expiry, :string
    end

    add_column :users, :pcard_id, :integer
    add_column :requisition_headers, :pcard_id, :integer
    add_column :order_headers, :pcard_id, :integer
  end

  def self.down
    drop_table :pcards
    remove_column :users, :pcard_id

    remove_column :requisition_headers, :pcard_id
    remove_column :order_headers, :pcard_id
  end
end
