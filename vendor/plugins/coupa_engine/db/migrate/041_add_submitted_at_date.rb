class AddSubmittedAtDate < ActiveRecord::Migration
  def self.up
    add_column :requisition_headers, :submitted_at, :datetime
    RequisitionHeader.find(:all).each do |rh|
      ev = rh.events.find(:first,:conditions => ['status in (?)',['pending_approval','pending_buyer_action']],:order => 'created_at DESC')
      if ev
        rh.update_attribute(:submitted_at,ev.created_at)
      end
    end
  end
  
  def self.down
    remove_column :requisition_headers, :submitted_at
  end
end