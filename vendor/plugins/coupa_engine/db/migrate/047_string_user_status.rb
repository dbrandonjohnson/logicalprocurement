class StringUserStatus < ActiveRecord::Migration
  @@statuses = []
  
  def self.up
    @@statuses = User.find(:all).collect { |u| [u.id, u.status] }
    remove_column :users, :status
    add_column :users, :status, :string
    User.reset_column_information
    @@statuses.each { |s| User.update(s.first, { :status => s.last }) }
  end
  
  def self.down
    @@statuses = User.find(:all).collect { |u| [u.id, u.status] }
    remove_column :users, :status
    add_column :users, :status, :text
    User.reset_column_information
    @@statuses.each { |s| User.update(s.first, { :status => s.last }) }
  end
end