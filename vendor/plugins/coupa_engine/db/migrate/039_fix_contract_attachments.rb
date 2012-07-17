class FixContractAttachments < ActiveRecord::Migration
  def self.up
    Contract.find_all.each { |c|
      if c.has_draft?
        draft = Contract.find_by_status_and_number('draft', c.number)
        c.attachment_links.each { |a| 
          d = draft.attachment_links.find_by_attachment_id(a.attachment_id)
          d.destroy if d
          draft.attachment_links.create(:attachment => a.attachment.clone) if a.attachment.valid?
        }
        draft.legal_agreement = File.open(c.legal_agreement) if (!draft.legal_agreement || !File.exists?(draft.legal_agreement)) && c.legal_agreement && File.exists?(c.legal_agreement)
      end
    }
  end

  def self.down
  end
end
