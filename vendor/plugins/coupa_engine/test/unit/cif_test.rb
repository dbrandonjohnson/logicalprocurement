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

class CIFTest < Test::Unit::TestCase  
  CIF_DATA = %(
    CIF_I_V3.0	
    CHARSET:	8859_1
    LOADMODE:	F
    CODEFORMAT:	UNSPSC
    CURRENCY:	USD
    SUPPLIERID_DOMAIN:	NETWORK_ID
    ITEMCOUNT:	5
    TIMESTAMP:	5/25/04
    UNUOM:	TRUE
    COMMENTS:	Template Catalog Content file for suppliers
    FIELDNAMES: Supplier ID,Supplier Part ID,Manufacturer Part ID,Item Description,SPSC Code,Unit Price,Unit of Measure,Lead Time,Manufacturer Name,Supplier URL,Manufacturer URL,Market Price,Currency,Regions,Language
    DATA
    AN010009999999,216M4GN,216M4GN,"4' Manyard, Green",23171500,55.45,EA,0,Dalloz Fall Protection - Miller,http://www.pdmw.com/Products/Solderable.htm,,47.88,USD,NATIONAL_USA,en
    AN010009999999,216TWLS,216TWLS,6'' Lanyard W/Locking Snap Hooks,46181500,35.3,EA,0,Dalloz Fall Protection - Miller,http://www.pdmw.com/Products/Solderable.htm,,38.18,USD,NATIONAL_USA,en
    AN010009999999,8554,8554,"Apron - Apron, Aluminized Split Leg Medium ",46181501,75.02,EA,10,JOHN TILLMAN,http://www.pdmw.com/Products/Solderable.htm,,59.98,USD,NATIONAL_USA,en
    AN010009999999,27002000,27002000,"Apron - Apron, Bib Black 35X45 Nitrile",46181501,10.15,EA,10,RAINFAIR,http://www.pdmw.com/Products/Solderable.htm,,8.6,USD,NATIONAL_USA,en
    AN010009999999,4236,4236,"Apron - Apron, Bib Leather 24X36 ",46181501,15.02,EA,10,JOHN TILLMAN,http://www.pdmw.com/Products/Solderable.htm,,14.54,USD,NATIONAL_USA,en
    ENDOFDATA
  )
  
  CIF_FIXTURE = %(
    --- !ruby/object:CIF 
    fields: 
    - Supplier ID
    - Supplier Part ID
    - Manufacturer Part ID
    - Item Description
    - SPSC Code
    - Unit Price
    - Unit of Measure
    - Lead Time
    - Manufacturer Name
    - Supplier URL
    - Manufacturer URL
    - Market Price
    - Currency
    - Regions
    - Language
    header: 
      :LOADMODE: F
      :UNUOM: "TRUE"
      :CODEFORMAT: UNSPSC
      :COMMENTS: Template Catalog Content file for suppliers
      :CURRENCY: USD
      :SUPPLIERID_DOMAIN: NETWORK_ID
      :FIELDNAMES: Supplier ID,Supplier Part ID,Manufacturer Part ID,Item Description,SPSC Code,Unit Price,Unit of Measure,Lead Time,Manufacturer Name,Supplier URL,Manufacturer URL,Market Price,Currency,Regions,Language
      :ITEMCOUNT: "5"
      :CHARSET: 8859_1
      :TIMESTAMP: 5/25/04
      :VERSION: "3.0"
    items: 
    - Manufacturer URL: ""
      Regions: NATIONAL_USA
      Unit Price: "55.45"
      Manufacturer Part ID: 216M4GN
      Manufacturer Name: Dalloz Fall Protection - Miller
      SPSC Code: "23171500"
      Item Description: 4' Manyard, Green
      Supplier ID: AN010009999999
      Market Price: "47.88"
      Language: en
      Currency: USD
      Unit of Measure: EA
      Supplier URL: http://www.pdmw.com/Products/Solderable.htm
      Supplier Part ID: 216M4GN
      Lead Time: "0"
    - Manufacturer URL: ""
      Regions: NATIONAL_USA
      Unit Price: "35.3"
      Manufacturer Part ID: 216TWLS
      Manufacturer Name: Dalloz Fall Protection - Miller
      SPSC Code: "46181500"
      Item Description: 6'' Lanyard W/Locking Snap Hooks
      Supplier ID: AN010009999999
      Market Price: "38.18"
      Language: en
      Currency: USD
      Unit of Measure: EA
      Supplier URL: http://www.pdmw.com/Products/Solderable.htm
      Supplier Part ID: 216TWLS
      Lead Time: "0"
    - Manufacturer URL: ""
      Regions: NATIONAL_USA
      Unit Price: "75.02"
      Manufacturer Part ID: "8554"
      Manufacturer Name: JOHN TILLMAN
      SPSC Code: "46181501"
      Item Description: Apron - Apron, Aluminized Split Leg Medium
      Supplier ID: AN010009999999
      Market Price: "59.98"
      Language: en
      Currency: USD
      Unit of Measure: EA
      Supplier URL: http://www.pdmw.com/Products/Solderable.htm
      Supplier Part ID: "8554"
      Lead Time: "10"
    - Manufacturer URL: ""
      Regions: NATIONAL_USA
      Unit Price: "10.15"
      Manufacturer Part ID: "27002000"
      Manufacturer Name: RAINFAIR
      SPSC Code: "46181501"
      Item Description: Apron - Apron, Bib Black 35X45 Nitrile
      Supplier ID: AN010009999999
      Market Price: "8.6"
      Language: en
      Currency: USD
      Unit of Measure: EA
      Supplier URL: http://www.pdmw.com/Products/Solderable.htm
      Supplier Part ID: "27002000"
      Lead Time: "10"
    - Manufacturer URL: ""
      Regions: NATIONAL_USA
      Unit Price: "15.02"
      Manufacturer Part ID: "4236"
      Manufacturer Name: JOHN TILLMAN
      SPSC Code: "46181501"
      Item Description: Apron - Apron, Bib Leather 24X36
      Supplier ID: AN010009999999
      Market Price: "14.54"
      Language: en
      Currency: USD
      Unit of Measure: EA
      Supplier URL: http://www.pdmw.com/Products/Solderable.htm
      Supplier Part ID: "4236"
      Lead Time: "10"
  )
  
  def test_parse
    assert cif = CIF.new(CIF_DATA)
    assert fixture = YAML::load(CIF_FIXTURE)
    assert_equal cif, fixture
  end
end
