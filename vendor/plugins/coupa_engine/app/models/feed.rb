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

class Feed < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'

  def rss
    if self.cache && self.last_checked_at && 
      (self.last_checked_at > Time.now.utc - 3600) && 
      (self.expires_at.nil? || self.expires_at > Time.now.utc) then
      return self.cache
    else
      uri = URI.parse(self.url)
      raise URI::InvalidURIError if uri.scheme != 'http'
      headers = {}
      if self.last_cached_at
        headers['If-Modified-Since'] = last_cached_at.rfc2822
      end
      begin
        uri.open(headers) do |f|
          logger.debug(f.status.join('|'))
          case f.status.first
          when "200"
            self.cache = f.read
            self.last_cached_at = Time.now.utc
            self.last_checked_at = Time.now.utc
            if f.meta['expires']
              self.expires_at = Time.httpdate(f.meta['expires']).utc
            end
            self.save
          else
            logger.debug("Other status:#{f.status.join(' ')}")
            raise "Can't retrieve RSS feed."
          end
        end
      rescue StandardError => err
        case err.to_s[0..2]
          when "304"
            # Not modified, so return the cached version
            logger.debug("Not modified.")
            self.last_checked_at = Time.now.utc
            self.save
          else
            logger.debug("Error:#{err}")
          end
      end
      self.cache
    end
  end

end
