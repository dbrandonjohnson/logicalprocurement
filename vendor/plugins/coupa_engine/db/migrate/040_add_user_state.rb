class AddUserState < ActiveRecord::Migration
  def self.up
    add_column :users, :status, :text, :limit => 50
    User.find_all.each { |u| u.update_attribute(:status, 'active') }
  end

  def self.down
    remove_column :users, :status
  end
end
