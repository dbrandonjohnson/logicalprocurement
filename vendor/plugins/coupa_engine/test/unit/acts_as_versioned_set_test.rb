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

require File.dirname(__FILE__) + '/../test_helper'

class ActsAsVersionedSetTest < Test::Unit::TestCase
  fixtures :order_headers, :order_header_versions, :order_lines, :order_line_versions,
    :uoms, :currencies
  
  def get_order_header
    OrderHeader.find_in_state(:first, :created, :order => 'created_at DESC')
  end
  
  def test_versioned_set_from_header
    header = get_order_header
    lines = header.order_lines
    
    vs = header.versioned_set
    assert_equal lines.size + 1, vs.size
    assert vs.include?(header)
    lines.each { |line| assert vs.include?(line) }
  end
  
  def test_versioned_set_from_line
    header = get_order_header
    lines = header.order_lines

    vs = lines.first.versioned_set
    assert_equal lines.size + 1, vs.size
    assert vs.include?(header)
    lines.each { |line| assert vs.include?(line) }    
  end
    
  def test_versioned_set_classes_from_header
    vsc = OrderHeader.versioned_set_classes
    assert_equal 2, vsc.length
    assert vsc.include?(OrderHeader)
    assert vsc.include?(OrderLine)
  end
  
  def test_versioned_set_classes_from_line
    vsc = OrderLine.versioned_set_classes
    assert_equal 2, vsc.length
    assert vsc.include?(OrderHeader)
    assert vsc.include?(OrderLine)
  end
  
  def test_sync_versioned_set_noop
    header = get_order_header
    lines = header.order_lines
    
    get_order_header.sync_versioned_set
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    
    assert header.version, new_header.version
    new_lines.each_with_index do |line, i|
      assert_equal lines[i].version, line.version
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end
  
  def test_sync_versioned_set_change_line
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    get_order_header.order_lines.first.save
    
    new_header = get_order_header
    new_lines = new_header.order_lines

    assert_equal header.version + 1, new_header.version
    new_lines.each_with_index do |line, i|
      assert_equal line_versions[i] + 1, line.version
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end
  
  def test_sync_versioned_set_change_header
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    get_order_header.save
    
    new_header = get_order_header
    new_lines = new_header.order_lines

    assert_equal header.version + 1, new_header.version
    new_lines.each_with_index do |line, i|
      assert_equal line_versions[i] + 1, line.version
      assert_equal new_header.versions.last, line.versions.last.order_header
    end    
  end
  
  def test_sync_versioned_set_delete_line
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    get_order_header.order_lines.first.destroy
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    assert_equal header.version + 1, new_header.version
    assert_equal line_versions[1..-1].collect { |v| v+1 }.to_set, new_lines.collect(&:version).to_set
    new_lines.each do |line|
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end
  
  def test_sync_versioned_set_add_line
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    line_attributes = lines.first.attributes
    line_attributes.delete("id")
    new_line = OrderLine.new
    line_attributes.each_pair { |k,v| new_line[k] = v }
    get_order_header.order_lines << new_line
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    assert_equal header.version + 1, new_header.version
    assert_equal line_versions.collect { |v| v+1 }.to_set << 1, new_lines.collect(&:version).to_set
    new_lines.each do |line|
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end
  
  def test_without_set_revision_on_header
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    OrderHeader.without_set_revision do
      get_order_header.order_lines.last.save
    end
    
    new_header = get_order_header
    new_lines = new_header.order_lines

    assert_equal header.version, new_header.version
    assert_equal line_versions.last + 1, new_lines.last.version
    assert_nil new_lines.last.versions.last.order_header
    new_lines[0..-2].each_with_index do |line, i|
      assert_equal line_versions[i], line.version
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end
  
  def test_without_set_revision_on_line
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    OrderLine.without_set_revision do
      get_order_header.order_lines.last.save
    end
    
    new_header = get_order_header
    new_lines = new_header.order_lines

    assert_equal header.version, new_header.version
    assert_equal line_versions.last + 1, new_lines.last.version
    assert_nil new_lines.last.versions.last.order_header
    new_lines[0..-2].each_with_index do |line, i|
      assert_equal line_versions[i], line.version
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end

  def test_versioned_set_transaction_on_header
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_header.versioned_set_transaction do
      new_lines.first.save
      new_lines.last.save
    end
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    assert_equal header.version + 1, new_header.version
    new_lines.each_with_index do |line, i|
      assert_equal line_versions[i] + 1, line.version
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end
  
  def test_versioned_set_transaction_on_line
    header = get_order_header
    lines = header.order_lines
    line_versions = lines.collect(&:version)
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_lines.first.versioned_set_transaction do
      new_lines.first.save
      new_lines.last.save
    end
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    assert_equal header.version + 1, new_header.version
    new_lines.each_with_index do |line, i|
      assert_equal line_versions[i] + 1, line.version
      assert_equal new_header.versions.last, line.versions.last.order_header
    end
  end
  
  def test_versioned_class_instance_respond_to
    assert OrderLine.find(:first).versions.last.respond_to?(:remaining)
  end
  
  def test_versioned_class_instance_method_missing
    line = get_order_header.order_lines.first
    assert_equal line.remaining, line.versions.last.remaining
  end
  
  def test_versioned_class_instance_kind_of
    header = get_order_header
    line = header.order_lines.first
    
    assert_equal header.is_a?(OrderHeader), header.versions.last.is_a?(OrderHeader)
    
    [OrderLine, OrderAmountLine, OrderQuantityLine].each do |c|
      assert_equal line.is_a?(c), line.versions.last.is_a?(c)
    end
  end
end