class DropRedundantTables < ActiveRecord::Migration
  def self.up
    drop_table :catalog_attributes
    drop_table :catalog_categories
    drop_table :catalog_headers
    drop_table :catalog_item_categories
    drop_table :catalog_item_attributes
    drop_table :catalog_item_attribute_values
  end
  
  def self.down
    create_table "catalog_attributes", :force => true do |t|
      t.column "name",       :string,   :limit => 100, :default => "", :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "catalog_categories", :force => true do |t|
      t.column "parent_id",      :integer
      t.column "children_count", :integer,                 :default => 0,  :null => false
      t.column "name",           :string,   :limit => 100, :default => "", :null => false
      t.column "created_by",     :integer
      t.column "updated_by",     :integer
      t.column "created_at",     :datetime
      t.column "updated_at",     :datetime
    end

    add_index "catalog_categories", ["name"], :name => "catalog_categories_name_index"

    create_table "catalog_headers", :force => true do |t|
      t.column "supplier_id", :integer,                 :default => 0,  :null => false
      t.column "name",        :string,   :limit => 100, :default => "", :null => false
      t.column "created_by",  :integer
      t.column "updated_by",  :integer
      t.column "created_at",  :datetime
      t.column "updated_at",  :datetime
    end

    create_table "catalog_item_attribute_values", :force => true do |t|
      t.column "item_id",      :integer,  :default => 0, :null => false
      t.column "attribute_id", :integer,  :default => 0, :null => false
      t.column "value",        :text
      t.column "created_by",   :integer
      t.column "updated_by",   :integer
      t.column "created_at",   :datetime
      t.column "updated_at",   :datetime
    end

    add_index "catalog_item_attribute_values", ["item_id"], :name => "catalog_item_attribute_values_item_id_index"

    create_table "catalog_item_attributes", :id => false, :force => true do |t|
      t.column "catalog_item_id",      :integer, :default => 0, :null => false
      t.column "catalog_attribute_id", :integer, :default => 0, :null => false
    end

    create_table "catalog_item_categories", :id => false, :force => true do |t|
      t.column "catalog_category_id", :integer, :default => 0, :null => false
      t.column "catalog_item_id",     :integer, :default => 0, :null => false
    end

    add_index "catalog_item_categories", ["catalog_item_id"], :name => "catalog_item_categories_catalog_item_id_index"
  end
end