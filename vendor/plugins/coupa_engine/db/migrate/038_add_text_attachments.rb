class AddTextAttachments < ActiveRecord::Migration
  def self.up
    add_column :attachments, :text, :text
  end

  def self.down
    remove_column :attachments, :text, :text
  end
end
