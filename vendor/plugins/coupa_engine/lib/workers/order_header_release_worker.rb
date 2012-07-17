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

class OrderHeaderReleaseWorker < BackgrounDRb::Rails
  def do_work(args)
    if args.is_a?(Hash)
      User.current_user = User.find_by_id(args[:user])
      data_source = DataBackgroundJobSource.find(args[:data])
    else
      data_source = DataBackgroundJobSource.find(args)
    end
    begin
      data_source.load!
    rescue ActiveRecord::StaleObjectError
      @logger.debug("Record stale!")
      data_source.reload
      data_source.load!
    end
    begin
      @progress = 0
      ohc = OrderHeader.find_all_by_supplier_id_and_status(data_source.parameters,'supplier_hold')
      ohc_count = ohc.size
      ohc.each_with_index do |order,i|
        @logger.debug("Creating order #{order.id}")
        begin
          order.create!
        rescue
          @logger.debug("Error:#{$!}")
        end
        if order.current_state == :created
          begin 
            # move this to a deferred queue
            order.send!
          rescue
            # raise an admin task here
            @logger.debug("Email PO failed")
          end
        end
        @progress = (i/ohc_count) * 100
      end
    ensure
      data_source.reload
      data_source.finish!
    end    
  end

  def progress
    @logger.debug "#{self.object_id} : progress = #{@progress}"
    @progress
  end
end
