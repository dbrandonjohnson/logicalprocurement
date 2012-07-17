class MoveCxmlToSupplier < ActiveRecord::Migration
  def self.up
    add_column :suppliers, :po_method, :string
    add_column :suppliers, :cxml_url, :string
    add_column :suppliers, :cxml_domain, :string
    add_column :suppliers, :cxml_identity, :string
    add_column :suppliers, :cxml_supplier_domain, :string
    add_column :suppliers, :cxml_supplier_identity, :string
    add_column :suppliers, :cxml_secret, :string
    add_column :suppliers, :cxml_protocol, :string
    remove_column :punchout_sites, :po_url
    remove_column :order_headers, :punchout_site_id

    Supplier.find(:all).each { |supplier|
      supplier.update_attribute(:po_method, 'email')
    }
  end

  def self.down
    add_column :punchout_sites, :po_url, :string
    add_column :order_headers, :punchout_site_id, :integer
    remove_column :suppliers, :po_method
    remove_column :suppliers, :cxml_url
    remove_column :suppliers, :cxml_domain
    remove_column :suppliers, :cxml_identity
    remove_column :suppliers, :cxml_supplier_domain
    remove_column :suppliers, :cxml_supplier_identity
    remove_column :suppliers, :cxml_secret
    remove_column :suppliers, :cxml_protocol
  end
end
