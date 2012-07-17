class AddApprovable < ActiveRecord::Migration
  def self.up
    add_column :approvals, :approvable_id, :integer
    add_column :approvals, :approvable_type, :string
    RequisitionHeader.find_in_state(:all,:pending_approval).each do |rh|
      update_tree(rh.approval,rh)
    end
  end

  def self.update_tree(node, approvable)
    node.update_attribute(:approvable,approvable)
    node.children.each do |cn|
      update_tree(cn,approvable)
    end
  end
  
  def self.down
    remove_column :approvals, :approvable_id
    remove_column :approvals, :approvable_type
  end
end