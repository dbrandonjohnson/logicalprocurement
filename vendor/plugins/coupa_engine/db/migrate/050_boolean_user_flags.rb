class BooleanUserFlags < ActiveRecord::Migration
  def self.up
    users = User.find(:all)
    ids, attributes = users.collect(&:id), users.collect { |user| { :deleted => user.deleted==1, :verified => user.verified==1 } }
    change_column :users, :deleted, :boolean, :default => false
    change_column :users, :verified, :boolean, :default => false
    User.reset_column_information
    User.update(ids, attributes)
  end
  
  def self.down
    users = User.find(:all)
    ids, attributes = users.collect(&:id), users.collect { |user| { :deleted => user.deleted ? 1 : 0, :verified => user.verified ? 1 : 0 } }
    change_column :users, :deleted, :integer, :default => 0
    change_column :users, :verified, :integer, :default => 0
    User.reset_column_information
    User.update(ids, attributes)
  end
end