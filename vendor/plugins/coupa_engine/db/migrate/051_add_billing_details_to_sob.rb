require 'application'

class AddBillingDetailsToSob < ActiveRecord::Migration
  self.extend(AddressesHelper)
  self.extend(ERB::Util)
  
  def self.up
    add_column :account_types, :primary_contact_id, :integer
    add_column :account_types, :primary_address_id, :integer
    add_column :account_types, :po_terms, :text
    AccountType.reset_column_information

    default_address = Address.find(:first)
    default_contact = Contact.find(:first)
     
    default_po_terms = <<-DEFAULT_PO_TERMS
<ul>
<li>Please send 2 copies of your invoice.</li>
<li>Enter this order in accordance with the prices, terms, delivery method, and specifications listed above.</li>
<li>Please notify us immediately if you are unable to ship as specified.</li>
<li>Send all correspondence to:<br>
#{address_to_html(default_address).gsub(%r(<br\s*/>), '<br>')}
<br></li>
</ul>
DEFAULT_PO_TERMS

    AccountType.find(:all).each do |at|
      at.attributes = {
        :po_terms => default_po_terms,
        :primary_address => default_address,
        :primary_contact => default_contact
      }
      at.save(false)
    end
  end

  def self.down
    remove_column :account_types, :primary_contact_id
    remove_column :account_types, :primary_address_id
    remove_column :account_types, :po_terms
  end
end
