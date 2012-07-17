class AddAssetTags < ActiveRecord::Migration
  def self.up
    create_table "asset_tags" do |t|
      t.column "order_line_id", :integer
      t.column "tag", :string
      t.column "created_at", :datetime
      t.column "created_by", :integer
      t.column "updated_at", :datetime
      t.column "updated_by", :integer
    end
  end
  
  def self.down
    drop_table "asset_tags"
  end
end