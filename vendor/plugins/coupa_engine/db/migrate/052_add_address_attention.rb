class AddAddressAttention < ActiveRecord::Migration
  
  def self.up
    add_column :addresses, :attention, :string
  end

  def self.down
    remove_column :addresses, :attention
  end
end
