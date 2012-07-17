class AddContactsPerm < ActiveRecord::Migration
  def self.up
    p1 = Permission.find_by_controller_and_action('contacts','show')
    br = Role.find_by_name('Buyer')
    br.permissions << p1
  end

  def self.down
    p1 = Permission.find_by_controller_and_action('contacts','show')
    br = Role.find_by_name('Buyer')
    br.permissions.delete(p1)
  end
end
