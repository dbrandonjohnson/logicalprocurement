#! /usr/local/bin/ruby -w

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

#require 'postinstall/set_environment'
require 'RMagick'
def gen_button(label)
button_label = label

# create transparent image
junk = Magick::Image.new(400,400) { self.background_color = "transparent" }

# draw button label on it
text = Magick::Draw.new
text.affine = Magick::AffineMatrix.new(0.75,0,0,0.75,0,0)
#text.font = '/Library/Fonts/Trebuchet\ MS'
text.font = '/Library/Fonts/test.ttf'
#text.font_weight = Magick::BoldWeight
text.pointsize = 12
text.density = "100x100"
text.gravity = Magick::CenterGravity
text.text_antialias = true
text.annotate(junk, 0,0,0,0, button_label) {
	self.stroke = '#036'
}	

# trim excess
textimage = junk.trim

# save resulting image's width
textwidth = textimage.columns

# now get the button template
buttonimage = Magick::Image.read("../public/images/button_template2.png")[0]
buttonimage.iptc_profile = nil

# divide into left and right sections, using textwidth+padding
leftimage = buttonimage.crop(Magick::NorthWestGravity,22,127,true)
rightimage = buttonimage.crop(Magick::NorthEastGravity,textwidth+23,127,true)

# put the button image back together now that it's the correct size
#result = rightimage.composite(leftimage,Magick::WestGravity,Magick::OverCompositeOp)
result = Magick::Image.new(textwidth+45,127) {
  self.background_color = 'transparent'
  self.image_type = Magick::TrueColorMatteType
}
result = result.composite(leftimage,Magick::WestGravity,Magick::OverCompositeOp)
result = result.composite(rightimage,Magick::EastGravity,Magick::OverCompositeOp)
# add the text
# note: need to annotate afresh rather than use image above
# because Magic::CenterGravity on img.composite doesn't handle lower case g's and y's and j's well
text = Magick::Draw.new
text.affine = Magick::AffineMatrix.new(0.75,0,0,0.75,0,0)
text.font = '/Library/Fonts/test.ttf'
#text.font_weight = Magick::BoldWeight
text.pointsize = 12
text.density = "100x100"
text.gravity = Magick::CenterGravity
text.text_antialias = true
text.fill = '#036'
#text.stroke = '#036'
text.annotate(result, 0,0,0,42, button_label) {
	self.stroke = 'transparent'
}	
text.annotate(result, 0,0,0,0, button_label) {
	self.stroke = 'transparent'
}	
text.annotate(result, 0,0,0,-37, button_label) {
	self.stroke = 'transparent'
}	
result = result.crop(Magick::CenterGravity,textwidth+30,126)

# write image
result.write('../public/images/buttons/' + button_label.gsub(' ','_').downcase + '.png')
end

def gen_small_button(label)
button_label = label

# create transparent image
junk = Magick::Image.new(400,400) { self.background_color = "transparent" }

# draw button label on it
text = Magick::Draw.new
text.affine = Magick::AffineMatrix.new(0.6,0,0,0.6,0,0)
text.font = '/Library/Fonts/test.ttf'
text.pointsize = 12
text.density = "100x100"
#text.font_weight = Magick::BoldWeight
text.gravity = Magick::CenterGravity
text.text_antialias = true
text.annotate(junk, 0,0,0,0, button_label) {
	self.stroke = '#036'
}	

# trim excess
textimage = junk.trim

# save resulting image's width
textwidth = textimage.columns

# now get the button template
buttonimage = Magick::Image.read("../public/images/button_template2_small.png")[0]

# divide into left and right sections, using textwidth+padding
leftimage = buttonimage.crop(Magick::NorthWestGravity,22,96,true)
rightimage = buttonimage.crop(Magick::NorthEastGravity,textwidth+23,96,true)

# put the button image back together now that it's the correct size
#result = rightimage.composite(leftimage,Magick::WestGravity,Magick::OverCompositeOp)
result = Magick::Image.new(textwidth+45,96) {
  self.background_color = 'transparent'
}
result = result.composite(leftimage,Magick::WestGravity,Magick::OverCompositeOp)
result = result.composite(rightimage,Magick::EastGravity,Magick::OverCompositeOp)
# add the text
# note: need to annotate afresh rather than use image above
# because Magic::CenterGravity on img.composite doesn't handle lower case g's and y's and j's well
text = Magick::Draw.new
text.affine = Magick::AffineMatrix.new(0.6,0,0,0.6,0,0)
text.font = '/Library/Fonts/test.ttf'
#text.font_weight = Magick::BoldWeight
text.pointsize = 12
text.density = "100x100"
text.gravity = Magick::CenterGravity
text.text_antialias = true
text.fill = '#036'
#text.stroke = '#036'
text.annotate(result, 0,0,0,28, button_label) {
	self.stroke = 'transparent'
}	
text.annotate(result, 0,0,0,-1, button_label) {
	self.stroke = 'transparent'
}	
text.annotate(result, 0,0,0,-27, button_label) {
	self.stroke = 'transparent'
}	
result = result.crop(Magick::CenterGravity,textwidth+30,96)

# write image
result.write('../public/images/buttons/' + button_label.gsub(' ','_').downcase + '_s.png')
end

gen_small_button 'Add to Cart'
gen_small_button 'Change'
gen_small_button 'Choose'
gen_small_button 'Delete'
gen_small_button 'Edit'
gen_small_button 'Edit or Delete Items'
gen_small_button 'Rate It'
gen_small_button 'View Req'
gen_button 'Add Review'
gen_button 'Add Tag'
gen_button 'Add to Cart'
gen_button 'Add Lines'
gen_button 'Approve'
gen_button 'Cancel'
gen_button 'Checkout'
gen_button 'Clear Cart'
gen_button 'Create'
gen_button 'Create New Questionnaire'
gen_button 'Edit'
gen_button 'Go!'
gen_button 'Post'
gen_button 'Query'
gen_button 'Reject'
gen_button 'Save'
gen_button 'Save and Publish'
gen_button 'See more details'
gen_button 'Send Email Template'
gen_button 'Submit for Approval'
gen_button 'Subscribe'
gen_button 'Tag It'
gen_button 'Update Cart'
gen_button 'Sign On'
