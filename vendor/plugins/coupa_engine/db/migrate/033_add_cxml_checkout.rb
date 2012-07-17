class AddCxmlCheckout < ActiveRecord::Migration
  def self.up
    add_column :order_headers, :punchout_site_id, :integer
    add_column :order_lines, :source_part_num, :string
    add_column :punchout_sites, :po_url, :string
  end

  def self.down
    remove_column :order_headers, :punchout_site_id
    remove_column :order_lines, :source_part_num
    remove_column :punchout_sites, :po_url
  end
end
