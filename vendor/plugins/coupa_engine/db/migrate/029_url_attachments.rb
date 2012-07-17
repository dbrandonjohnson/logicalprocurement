class UrlAttachments < ActiveRecord::Migration
  def self.up
    add_column :attachments, :type, :string
    add_column :attachments, :url, :string
    Attachment.find(:all).each do |att|
      att.update_attribute(:type,'AttachmentFile')
    end
    AttachmentLink.find_all_by_intent('Buyer').each do |al|
      al.update_attribute(:intent,'Internal')
    end
  end
  
  def self.down
    remove_column :attachments, :type
    remove_column :attachments, :url
    AttachmentLink.find_all_by_intent('Internal').each do |al|
      al.update_attribute(:intent,'Buyer')
    end
  end
end