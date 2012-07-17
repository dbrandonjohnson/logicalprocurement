class MoveAttachments < ActiveRecord::Migration
  def self.up
    FileUtils.makedirs(File.join(RAILS_ROOT, "storage"))
    FileUtils.cp_r(File.join(RAILS_ROOT, "public", "attachment_file"), File.join(RAILS_ROOT, "storage")) if FileTest.exists?(File.join(RAILS_ROOT, "public", "attachment_file"))
    FileUtils.rm_rf(File.join(RAILS_ROOT, "public", "attachment_file"))
  end
  
  def self.down
    FileUtils.cp_r(File.join(RAILS_ROOT, "storage", "attachment_file"), File.join(RAILS_ROOT, "public")) if FileTest.exists?(File.join(RAILS_ROOT, "storage", "attachment_file"))
    FileUtils.rm_rf(File.join(RAILS_ROOT, "storage", "attachment_file"))
  end
end