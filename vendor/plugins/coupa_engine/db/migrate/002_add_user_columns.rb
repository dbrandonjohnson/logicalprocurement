class AddUserColumns < ActiveRecord::Migration
  def self.up
    unless User.table_exists?
      raise StandardError.new("The users table does not exist, make sure LoginEngine and UserEngine migrations are executed before migrating CoupaEngine.")
    end
    add_column LoginEngine.config(:user_table), "approval_limit_id", :integer
    add_column LoginEngine.config(:user_table), "manager_id", :integer
    add_column LoginEngine.config(:user_table), "default_address_id", :integer
    add_column LoginEngine.config(:user_table), "default_account_id", :integer
    add_column LoginEngine.config(:user_table), "deleted_at", :datetime
  end
  
  def self.down
    remove_column LoginEngine.config(:user_table), "approval_limit_id"
    remove_column LoginEngine.config(:user_table), "manager_id"
    remove_column LoginEngine.config(:user_table), "default_address_id"
    remove_column LoginEngine.config(:user_table), "default_account_id"
    remove_column LoginEngine.config(:user_table), "deleted_at"
  end
end
