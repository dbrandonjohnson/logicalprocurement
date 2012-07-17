class ContractPreferred < ActiveRecord::Migration
  def self.up
    add_column :contracts, :preferred_flag, :boolean
    Contract.find(:all,:conditions => ['status = \'published\'']).each do |con|
      con.update_attribute(:preferred_flag,true)
    end
  end
  
  def self.down
    remove_column :contracts, :preferred_flag
  end
end