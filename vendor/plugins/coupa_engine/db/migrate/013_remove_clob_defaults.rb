class RemoveClobDefaults < ActiveRecord::Migration
  def self.up
    change_column("catalog_item_attribute_values", "value", :text)
  end

  def self.down
    change_column("catalog_item_attribute_values", "value", :text, :default => "", :null => false)
  end
end
