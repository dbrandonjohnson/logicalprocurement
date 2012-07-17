class ConvertDateToTime < ActiveRecord::Migration
  def self.up
    change_column :requisition_headers, :need_by_date, :datetime
  end

  def self.down
    change_column :requisition_headers, :need_by_date, :date
  end
end
