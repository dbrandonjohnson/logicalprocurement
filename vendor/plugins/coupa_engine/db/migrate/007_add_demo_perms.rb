class AddDemoPerms < ActiveRecord::Migration
  def self.up
    p1 = Permission.find_by_controller_and_action('requisition_headers','email_template')
    p2 = Permission.find_by_controller_and_action('requisition_line_templates','add_to_requisition')
    ur = Role.find_by_name('User')
    br = Role.find_by_name('Buyer')
    ur.permissions << p1 << p2
    br.permissions << p1 << p2
  end

  def self.down
    p1 = Permission.find_by_controller_and_action('requisition_headers','email_template')
    p2 = Permission.find_by_controller_and_action('requisition_line_templates','add_to_requisition')
    ur = Role.find_by_name('User')
    br = Role.find_by_name('Buyer')
    ur.permissions.delete(p1,p2)
    br.permissions.delete(p1,p2)
  end
end
