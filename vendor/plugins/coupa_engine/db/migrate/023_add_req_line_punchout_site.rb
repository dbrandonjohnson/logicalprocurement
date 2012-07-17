class AddReqLinePunchoutSite < ActiveRecord::Migration
  def self.up
    add_column :requisition_lines, :punchout_site_id, :integer
  end
  
  def self.down
    remove_column :requisition_lines, :punchout_site_id
  end
end