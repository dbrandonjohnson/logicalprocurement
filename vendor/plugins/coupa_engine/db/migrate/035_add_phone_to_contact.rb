class AddPhoneToContact < ActiveRecord::Migration
  def self.up
    add_column :users, :phone_work, :string
    add_column :users, :phone_mobile, :string
  end

  def self.down
    remove_column :users, :phone_work
    remove_column :users, :phone_mobile
  end
end
