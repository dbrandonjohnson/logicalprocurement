class AddMultiCurrency < ActiveRecord::Migration
  def self.up
    OrderHeader.find(:all,:conditions => ['status = \'new\'']).each do |oh|
      oh.update_attribute(:status,'created')
    end
    add_column :order_lines, :status, :string, :limit => 50
    add_column :order_lines, :currency_id, :integer
    add_column :order_lines, :accounting_total, :float
    add_column :order_lines, :accounting_total_currency_id, :integer # ??? (derivable)

    OrderLine.reset_column_information
    OrderLine.find(:all).each do |line|
      case line.order_header.status.to_sym
      when :draft
        line.update_attribute(:status,'draft')
      when :created
        line.update_attribute(:status,'created')
      when :sent
        line.update_attribute(:status,'created')
      end
    end
    
    add_column :currencies, :enabled_flag, :boolean
    Currency.reset_column_information
    def_cur = Currency.find_by_code('USD')
    def_cur.update_attribute(:enabled_flag,true)

    OrderLine.find(:all).each do |line|
      line.update_attribute(:currency_id,def_cur.id)
      line.update_attribute(:accounting_total_currency_id,def_cur.id)
    end
    
    add_column :requisition_lines, :currency_id, :integer
    RequisitionLine.reset_column_information
    RequisitionLine.find(:all).each do |line|
      line.update_attribute(:currency_id,def_cur.id)
    end
    
    add_column :catalog_items, :list_price_currency_id, :integer # ??? (derivable)
    CatalogItem.reset_column_information
    CatalogItem.find(:all).each do |line|
      line.update_attribute(:list_price_currency_id,def_cur.id)
    end
    
    add_column :receipts, :currency_id, :integer
    Receipt.reset_column_information
    Receipt.find(:all).each do |line|
      line.update_attribute(:currency_id,def_cur.id)
    end
    
    add_column :users, :default_currency_id, :integer
    User.reset_column_information
    User.find(:all).each do |line|
      line.update_attribute(:default_currency_id,def_cur.id)
    end
    
    add_column :account_types, :currency_id, :integer
    AccountType.reset_column_information
    AccountType.find(:all).each do |at|
      at.update_attribute(:currency_id,def_cur.id)
    end
    
    ApprovalLimit.find(:all).each do |line|
      line.update_attribute(:currency_id,def_cur.id)
    end

    Contract.find(:all).each do |line|
      line.update_attribute(:currency_id,def_cur.id)
    end

    create_table :exchange_rates do |t|
      t.column :from_currency_id, :integer
      t.column :to_currency_id, :integer
      t.column :rate, :float
      t.column :rate_date, :datetime
      t.column :created_by, :integer
      t.column :created_at, :datetime
      t.column :updated_by, :integer
      t.column :updated_at, :datetime
    end
    
  end
  
  def self.down
    remove_column :order_lines, :status
    remove_column :order_lines, :currency_id
    remove_column :order_lines, :accounting_total
    remove_column :order_lines, :accounting_total_currency_id # ??? (derivable)
    
    remove_column :requisition_lines, :currency_id
    
    remove_column :catalog_items, :list_price_currency_id # ??? (derivable)
    
    remove_column :receipts, :currency_id
    
    remove_column :users, :default_currency_id

    remove_column :account_types, :currency_id
    drop_table :exchange_rates
    
    remove_column :currencies, :enabled_flag
  end
end