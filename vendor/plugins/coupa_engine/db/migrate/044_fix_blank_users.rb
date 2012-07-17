class FixBlankUsers < ActiveRecord::Migration
  def self.up
    User.find_all.each { |u| u.update_attribute(:status,'active') if u.status.blank? }
  end

  def self.down
  end
end
