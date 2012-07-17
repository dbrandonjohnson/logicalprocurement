class AddApproverKey < ActiveRecord::Migration
  def self.up
    add_column :approvals, "approval_key", :string, :limit => 100
    Approval.find(:all,:include => :user,:conditions => ['approval_key is null and status = \'pending_approval\'']).each do |app|
      if app.user
        app.update_attribute(:approval_key,Digest::SHA1.hexdigest("#{app.user.fullname}#{Time.now}#{app.id}")[0..99])
      end
    end
  end
  
  def self.down
    remove_column :approvals, "approval_key"
  end
end
