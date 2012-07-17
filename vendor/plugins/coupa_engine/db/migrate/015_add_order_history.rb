class AddOrderHistory < ActiveRecord::Migration
  def self.up
    create_table "order_event_history" do |t|
      t.column "order_header_id", :integer
      t.column "status", :string, :limit => 50
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end
    
    OrderHeader.find(:all,:conditions => ['status = \'new\'']).each do |order|
      order.update_attribute(:status,'created')
    end
    
  end
  
  def self.down
    drop_table "order_event_history"
  end
end