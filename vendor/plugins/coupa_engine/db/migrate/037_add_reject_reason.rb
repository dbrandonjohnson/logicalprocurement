class AddRejectReason < ActiveRecord::Migration
  def self.up
    add_column :requisition_headers, :reject_reason, :text
  end

  def self.down
    remove_column :requisition_headers, :reject_reason
  end
end
