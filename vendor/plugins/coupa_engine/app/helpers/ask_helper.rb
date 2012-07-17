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

module AskHelper
  def reload_form_and_list list
    form = Inflector.singularize(list) + '_form'
    page.reload_flash
    page[form].reload
    page[list].reload
    page[list].visual_effect :highlight
  end
    
  def category_names_and_ids
    AskCategory.find(:all, :order => 'name').collect { |c| [c.name, c.id] }
  end
  
  def subscriber_names_and_ids
    User.find(:all, :order => 'firstname, lastname', :conditions => ['status=?','active']).collect { |u| [u.fullname, u.id] }
  end
  
  def answer_button
    page['answer_buttons'].hide
    page['close_form'].hide
    page['answer_form'].show
    page['answer_text'].focus
  end
  
  def close_button
    page['answer_buttons'].hide
    page['answer_form'].hide
    page['close_form'].show
    page['close_text'].focus
  end
  
  def hide_answer_form
    page['answer_form'].hide
    page['answer_buttons'].show
  end
  
  def hide_close_form
    page['close_form'].hide
    page['answer_buttons'].show
  end
end
