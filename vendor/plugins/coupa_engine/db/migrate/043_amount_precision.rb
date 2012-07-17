class AmountPrecision < ActiveRecord::Migration
  def self.up
    change_column(:approval_limits,:amount,:decimal,{:scale => 2, :precision => 30})
    change_column(:catalog_items,:list_price,:decimal,{:scale => 2, :precision => 30})
    change_column(:requisition_lines,:unit_price,:decimal,{:scale => 2, :precision => 30})
    change_column(:requisition_lines,:total,:decimal,{:scale => 2, :precision => 30})
    change_column(:order_lines,:price,:decimal,{:scale => 2, :precision => 30})
    change_column(:order_lines,:total,:decimal,{:scale => 2, :precision => 30})
    change_column(:order_lines,:accounting_total,:decimal,{:scale => 2, :precision => 30})
    change_column(:order_line_versions,:price,:decimal,{:scale => 2, :precision => 30})
    change_column(:order_line_versions,:total,:decimal,{:scale => 2, :precision => 30})
    change_column(:order_line_versions,:accounting_total,:decimal,{:scale => 2, :precision => 30})
    change_column(:invoice_lines,:price,:decimal,{:scale => 2, :precision => 30})
    change_column(:invoice_lines,:total,:decimal,{:scale => 2, :precision => 30})
    change_column(:invoice_lines,:accounting_total,:decimal,{:scale => 2, :precision => 30})
    change_column(:invoice_headers,:shipping_amount,:decimal,{:scale => 2, :precision => 30})
    change_column(:invoice_headers,:handling_amount,:decimal,{:scale => 2, :precision => 30})
    change_column(:invoice_headers,:tax_amount,:decimal,{:scale => 2, :precision => 30})
    change_column(:invoice_headers,:misc_amount,:decimal,{:scale => 2, :precision => 30})
    change_column(:receipts,:unit_price,:decimal,{:scale => 2, :precision => 30})
    change_column(:receipts,:total,:decimal,{:scale => 2, :precision => 30})
    change_column(:requisition_line_templates,:unit_price,:decimal,{:scale => 2, :precision => 30})
    RequisitionLine.find(:all).each do |x|
      x.save(false)
    end
    OrderLine.find(:all).each do |x|
      x.order_header.without_set_revision do
        x.without_revision do
          x.save(false)
        end
      end
    end
  end
  
  def self.down
    change_column(:approval_limits,:amount,:float)
    change_column(:catalog_items,:list_price,:float)
    change_column(:requisition_lines,:unit_price,:float)
    change_column(:requisition_lines,:total,:float)
    change_column(:order_lines,:price,:float)
    change_column(:order_lines,:total,:float)
    change_column(:order_lines,:accounting_total,:float)
    change_column(:order_line_versions,:price,:float)
    change_column(:order_line_versions,:total,:float)
    change_column(:order_line_versions,:accounting_total,:float)
    change_column(:invoice_lines,:price,:float)
    change_column(:invoice_lines,:total,:float)
    change_column(:invoice_lines,:accounting_total,:float)
    change_column(:invoice_headers,:shipping_amount,:float)
    change_column(:invoice_headers,:handling_amount,:float)
    change_column(:invoice_headers,:tax_amount,:float)
    change_column(:invoice_headers,:misc_amount,:float)
    change_column(:receipts,:unit_price,:float)
    change_column(:receipts,:total,:float)
    change_column(:requisition_line_templates,:unit_price,:float)
  end
end