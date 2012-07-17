class AddNeedByDate < ActiveRecord::Migration
  def self.up
    add_column :requisition_lines, :need_by_date, :datetime
    add_column :catalog_items, :lead_time, :integer
    add_column :punchout_sites, :lead_time, :integer
    add_column :requisition_line_templates, :lead_time, :integer
  end
  
  def self.down
    remove_column :requisition_line_templates, :lead_time
    remove_column :punchout_sites, :lead_time
    remove_column :catalog_items, :lead_time
    remove_column :requisition_lines, :need_by_date
  end
end