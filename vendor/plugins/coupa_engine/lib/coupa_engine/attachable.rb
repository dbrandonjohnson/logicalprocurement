# Copyright (C) 2007  Coupa Software Incorporated http://www.coupa.com
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

module Attachable
  def self.included(base)
    base.class_eval do
      has_many :attachment_links, :as => :attachable do
        def printable_for_supplier
          find_all_by_intent('Supplier').collect(&:attachment).select do |a| 
            (a.is_a? AttachmentUrl) || (a.is_a? AttachmentText) 
          end
        end 
      end

      has_many :attachments, :through => :attachment_links, :dependent => :destroy
    end
  end
  
  def has_attachments?
    !attachments.empty?
  end
  
  def update_attributes(new_attributes)
    # The funny round-about is so that we retain all ActiveRecord errors in each validation
    super(new_attributes.without(:attachment, :attachment_link, :attachment_links)) & update_attachments(new_attributes.only(:attachment, :attachment_link, :attachment_links)) 
  end
  
  def update_attachments(new_attributes)
    return true if new_attributes.empty?

    new_attachment = new_attributes.delete(:attachment)
    new_attachment_link = new_attributes.delete(:attachment_link) || {:intent => nil}

    existing_links = new_attributes.delete(:attachment_links)
    
    if existing_links
      existing_links.each do |p_id,p_intent|
        al = self.attachment_links.find_by_id(p_id.to_i)
        al.update_attribute(:intent,p_intent[:intent]) if al
      end
    end
    if new_attachment && new_attachment[:type]
      return false unless ['AttachmentFile','AttachmentUrl','AttachmentText'].index(new_attachment[:type])
      attribs = case new_attachment[:type]
                     when 'AttachmentFile': new_attachment
                     when 'AttachmentUrl':  new_attachment.only(:url)
                     when 'AttachmentText': new_attachment.only(:text)
                end
      unless new_attachment[:type] && (new_attachment[:type] == 'AttachmentFile') && (new_attachment[:file].blank? || new_attachment[:file].size == 0)
        attachment = new_attachment[:type].constantize.new(attribs)
        unless attachment.save && self.attachment_links.create(:attachment => attachment, :intent => new_attachment_link[:intent]).errors.empty?
           self.errors.add_to_base "Attaching #{new_attachment[:type].sub!(/Attachment/,'')} failed: #{attachment.errors.empty? ? self.attachment_links.errors.full_messages.first : attachment.errors.full_messages.first}"
           return false
        end
      end
    end
    true
  end
end
