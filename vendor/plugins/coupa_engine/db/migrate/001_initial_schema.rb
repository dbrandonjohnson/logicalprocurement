class InitialSchema < ActiveRecord::Migration
  def self.up
    create_table "account_allocations" do |t|
      t.column "account_id", :integer
      t.column "amount", :float
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "allocable_id", :integer
      t.column "allocable_type", :string, :limit => 50
    end

    create_table "account_field_types" do |t|
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "name", :string, :limit => 50
      t.column "code", :string, :limit => 6
      t.column "validation_regex", :string
    end

    create_table "account_types" do |t|
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "name", :string, :limit => 50
      t.column "segment_1_field_type_id", :integer
      t.column "segment_2_field_type_id", :integer
      t.column "segment_3_field_type_id", :integer
      t.column "segment_4_field_type_id", :integer
      t.column "segment_5_field_type_id", :integer
      t.column "segment_6_field_type_id", :integer
      t.column "segment_7_field_type_id", :integer
      t.column "segment_8_field_type_id", :integer
      t.column "segment_9_field_type_id", :integer
      t.column "segment_10_field_type_id", :integer
      t.column "segment_11_field_type_id", :integer
      t.column "segment_12_field_type_id", :integer
      t.column "segment_13_field_type_id", :integer
      t.column "segment_14_field_type_id", :integer
      t.column "segment_15_field_type_id", :integer
      t.column "segment_16_field_type_id", :integer
      t.column "segment_17_field_type_id", :integer
      t.column "segment_18_field_type_id", :integer
      t.column "segment_19_field_type_id", :integer
      t.column "segment_20_field_type_id", :integer
    end

    create_table "accounts" do |t|
      t.column "name", :string, :limit => 100
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "account_type_id", :integer
      t.column "segment_1", :string, :limit => 40
      t.column "segment_2", :string, :limit => 40
      t.column "segment_3", :string, :limit => 40
      t.column "segment_4", :string, :limit => 40
      t.column "segment_5", :string, :limit => 40
      t.column "segment_6", :string, :limit => 40
      t.column "segment_7", :string, :limit => 40
      t.column "segment_8", :string, :limit => 40
      t.column "segment_9", :string, :limit => 40
      t.column "segment_10", :string, :limit => 40
      t.column "segment_11", :string, :limit => 40
      t.column "segment_12", :string, :limit => 40
      t.column "segment_13", :string, :limit => 40
      t.column "segment_14", :string, :limit => 40
      t.column "segment_15", :string, :limit => 40
      t.column "segment_16", :string, :limit => 40
      t.column "segment_17", :string, :limit => 40
      t.column "segment_18", :string, :limit => 40
      t.column "segment_19", :string, :limit => 40
      t.column "segment_20", :string, :limit => 40
    end

    create_table "address_assignments" do |t|
      t.column "addressable_id", :integer
      t.column "addressable_type", :string, :limit => 50
      t.column "address_type_id", :integer
      t.column "address_id", :integer
    end

    create_table "addresses" do |t|
      t.column "name", :string, :limit => 50
      t.column "street1", :string, :limit => 100
      t.column "street2", :string, :limit => 100
      t.column "city", :string, :limit => 50
      t.column "state", :string, :limit => 50
      t.column "postal_code", :string, :limit => 50
      t.column "country_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "address_owner_id", :integer
      t.column "address_owner_type", :string, :limit => 100
    end

    create_table "approval_limits" do |t|
      t.column "amount", :float
      t.column "currency_id", :integer
    end

    create_table "approvals" do |t|
      t.column "parent_id", :integer
      t.column "user_id", :integer
      t.column "status", :string, :limit => 50
      t.column "approval_date", :datetime
      t.column "note", :text
    end

    create_table "ask_answers" do |t|
      t.column "ask_question_id", :integer
      t.column "text", :text
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "ask_categories" do |t|
      t.column "name", :string, :limit => 50
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "private", :boolean, :default => false
    end

    create_table "ask_moderators" do |t|
      t.column "ask_category_id", :integer
      t.column "user_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "ask_questions" do |t|
      t.column "text", :text
      t.column "ask_category_id", :string, :limit => 50
      t.column "status", :string, :limit => 50
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "ask_subscriptions" do |t|
      t.column "ask_category_id", :integer
      t.column "subscriber_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "email_notifications", :boolean, :default => false
    end

    create_table "attachment_links" do |t|
      t.column "attachable_id", :integer
      t.column "attachable_type", :string, :limit => 50
      t.column "attachment_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "intent", :string, :limit => 50
    end

    create_table "attachments" do |t|
      t.column "file", :string, :default => "", :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "catalog_attributes" do |t|
      t.column "name", :string, :limit => 100, :default => "", :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "catalog_categories" do |t|
      t.column "parent_id", :integer
      t.column "children_count", :integer, :default => 0, :null => false
      t.column "name", :string, :limit => 100, :default => "", :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    add_index "catalog_categories", ["name"], :name => "catalog_categories_name_index"

    create_table "catalog_headers" do |t|
      t.column "supplier_id", :integer, :default => 0, :null => false
      t.column "name", :string, :limit => 100, :default => "", :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "catalog_item_attribute_values" do |t|
      t.column "item_id", :integer, :default => 0, :null => false
      t.column "attribute_id", :integer, :default => 0, :null => false
      t.column "value", :text
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    add_index "catalog_item_attribute_values", ["item_id"], :name => "catalog_item_attribute_values_item_id_index"

    create_table "catalog_item_attributes", :id => false do |t|
      t.column "catalog_item_id", :integer, :default => 0, :null => false
      t.column "catalog_attribute_id", :integer, :default => 0, :null => false
    end

    create_table "catalog_item_categories", :id => false do |t|
      t.column "catalog_category_id", :integer, :default => 0, :null => false
      t.column "catalog_item_id", :integer, :default => 0, :null => false
    end

    add_index "catalog_item_categories", ["catalog_item_id"], :name => "catalog_item_categories_catalog_item_id_index"

    create_table "catalog_items" do |t|
      t.column "catalog_header_id", :integer, :default => 0, :null => false
      t.column "name", :string, :default => "", :null => false
      t.column "description", :text
      t.column "uom_id", :integer, :default => 0, :null => false
      t.column "list_price", :float
      t.column "image", :string
      t.column "product_reviews_count", :integer, :default => 0, :null => false
      t.column "avg_rating", :float, :default => 0.0, :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "source_part_num", :string, :limit => 50
      t.column "cached_at", :datetime
      t.column "form_id", :integer
      t.column "contract_id", :integer
    end

    add_index "catalog_items", ["source_part_num"], :name => "catalog_items_source_part_num_index"
    add_index "catalog_items", ["name"], :name => "catalog_items_name_index"

    create_table "contacts" do |t|
      t.column "email", :string, :limit => 60
      t.column "phone_work", :string, :limit => 50
      t.column "photo", :string
      t.column "notes", :text
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "phone_mobile", :string, :limit => 50
      t.column "name_prefix", :string, :limit => 10
      t.column "name_suffix", :string, :limit => 10
      t.column "name_additional", :string, :limit => 50
      t.column "name_given", :string, :limit => 40
      t.column "name_family", :string, :limit => 40
      t.column "name_fullname", :string, :limit => 155
    end

    create_table "contracts" do |t|
      t.column "name", :string, :limit => 100
      t.column "number", :string, :limit => 50
      t.column "version", :integer
      t.column "supplier_id", :integer
      t.column "start_date", :datetime
      t.column "end_date", :datetime
      t.column "status", :string, :limit => 50
      t.column "discount", :float
      t.column "minimum_value", :float
      t.column "maximum_value", :float
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "currency_id", :integer
      t.column "terms", :text
      t.column "bill_to_address_id", :integer
      t.column "legal_agreement", :string
      t.column "catalog", :string
    end

    create_table "countries" do |t|
      t.column "code", :string, :limit => 4
      t.column "name", :string, :limit => 100
      t.column "position", :integer
    end

    create_table "currencies" do |t|
      t.column "code", :string, :limit => 6, :default => "", :null => false
      t.column "name", :string, :limit => 100, :default => "", :null => false
      t.column "min_accountable_unit", :float
      t.column "symbol", :string, :limit => 1
    end

    add_index "currencies", ["code"], :name => "currencies_code_index", :unique => true

    create_table "data_sources" do |t|
      t.column "file", :string
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "type", :string, :limit => 50
      t.column "source_for", :string, :limit => 50
      t.column "status", :string, :limit => 50
      t.column "job_key", :string, :limit => 50
      t.column "lock_version", :integer, :default => 0, :null => false
      t.column "owner_type", :string, :limit => 50
      t.column "owner_id", :integer
      t.column "error_text", :text
    end

    create_table "feeds" do |t|
      t.column "name", :string, :limit => 100
      t.column "url", :string
      t.column "cache", :text
      t.column "cache_data_type", :string, :limit => 50
      t.column "last_cached_at", :datetime
      t.column "expires_at", :datetime
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "last_checked_at", :datetime
    end

    create_table "form_responses" do |t|
      t.column "response", :text
      t.column "status", :string, :limit => 50
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "form_id", :integer
    end

    create_table "forms" do |t|
      t.column "name", :string, :limit => 100
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "description", :string
      t.column "status", :string, :limit => 50
    end

    create_table "languages" do |t|
      t.column "code", :string, :limit => 12, :default => "", :null => false
      t.column "name", :string, :limit => 100, :default => "", :null => false
    end

    create_table "notifications" do |t|
      t.column "body", :text
      t.column "read_flag", :boolean
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "user_id", :integer
      t.column "type", :string, :limit => 50
      t.column "status", :string, :limit => 50
      t.column "subject", :string, :limit => 100
      t.column "notifier_id", :integer
      t.column "notifier_type", :string, :limit => 50
    end

    create_table "objections" do |t|
      t.column "product_review_id", :integer
      t.column "status", :string, :limit => 20
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "deleted_at", :datetime
    end

    create_table "order_headers" do |t|
      t.column "supplier_id", :integer, :default => 0, :null => false
      t.column "status", :string, :limit => 50
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "ship_to_address_id", :integer
      t.column "ship_to_user_id", :integer
      t.column "supplier_view_key", :string
    end

    create_table "order_lines" do |t|
      t.column "order_header_id", :integer, :default => 0, :null => false
      t.column "item_id", :integer
      t.column "price", :float
      t.column "quantity", :float
      t.column "uom_id", :integer
      t.column "line_num", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "contract_id", :integer
      t.column "form_response_id", :integer
      t.column "total", :float
      t.column "description", :string
      t.column "supplier_id", :integer
    end

    create_table "organizations" do |t|
      t.column "parent_id", :integer
      t.column "code", :string, :limit => 12, :default => "", :null => false
      t.column "name", :string, :limit => 100, :default => "", :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "organizations_users", :id => false do |t|
      t.column "organization_id", :integer
      t.column "user_id", :integer
    end

    create_table "policies" do |t|
      t.column "category_id", :integer
      t.column "name", :string, :limit => 100
      t.column "text", :text
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "product_reviews" do |t|
      t.column "catalog_item_id", :integer, :default => 0, :null => false
      t.column "rating", :integer, :default => 0, :null => false
      t.column "title", :string, :limit => 100
      t.column "text", :text
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "source_id", :integer, :default => 0, :null => false
      t.column "reviewer", :string, :limit => 100
      t.column "reviewed_at", :datetime
      t.column "deleted_at", :datetime
    end

    create_table "projects" do |t|
      t.column "name", :string, :limit => 100
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "punchin_sessions" do |t|
      t.column "user_id", :integer
      t.column "buyer_cookie", :string
      t.column "checkout_url", :string
      t.column "start_page", :string
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
    end

    create_table "punchout_sessions" do |t|
      t.column "user_id", :integer
      t.column "punchout_site_id", :integer
      t.column "buyer_cookie", :string
      t.column "seller_cookie", :string
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
    end

    create_table "punchout_sites" do |t|
      t.column "name", :string
      t.column "url", :string
      t.column "description", :string
      t.column "domain", :string
      t.column "identity", :string
      t.column "secret", :string
      t.column "sender_domain", :string
      t.column "sender_identity", :string
      t.column "protocol", :string
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
      t.column "contract_id", :integer
    end

    create_table "requisition_event_history" do |t|
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "requisition_header_id", :integer
      t.column "status", :string, :limit => 50
    end

    create_table "requisition_headers" do |t|
      t.column "status", :string, :limit => 50, :default => "", :null => false
      t.column "requested_by", :integer
      t.column "need_by_date", :date
      t.column "account_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "ship_to_address_id", :integer
      t.column "approval_id", :integer
      t.column "justification", :text
      t.column "deleted_at", :datetime
      t.column "buyer_note", :text
    end

    create_table "requisition_line_templates" do |t|
      t.column "name", :string, :limit => 100
      t.column "form_id", :integer
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :integer
      t.column "line_type", :string, :limit => 100
      t.column "description", :string
      t.column "quantity", :float
      t.column "uom_id", :integer
      t.column "unit_price", :float
      t.column "description_locked", :boolean
      t.column "quantity_locked", :boolean
      t.column "uom_locked", :boolean
      t.column "unit_price_locked", :boolean
      t.column "supplier_id", :integer
      t.column "supplier_locked", :boolean
      t.column "supplier_address_id", :integer
      t.column "supplier_address_locked", :boolean
      t.column "contract_id", :integer
      t.column "contract_locked", :boolean
      t.column "status", :string, :limit => 50
    end

    create_table "requisition_lines" do |t|
      t.column "header_id", :integer, :default => 0, :null => false
      t.column "line_num", :integer, :default => 0, :null => false
      t.column "description", :string
      t.column "item_id", :integer
      t.column "quantity", :float
      t.column "uom_id", :integer
      t.column "unit_price", :float
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "order_line_id", :integer
      t.column "deleted_at", :datetime
      t.column "total", :float
      t.column "type", :string, :limit => 100
      t.column "status", :string, :limit => 50
      t.column "suggested_suppliers", :string
      t.column "requisition_line_template_id", :integer
      t.column "supplier_id", :integer
      t.column "contract_id", :integer
      t.column "form_response_id", :integer
      t.column "released_by_buyer", :boolean
      t.column "source_part_num", :string
    end
    
    create_table "setup" do |t|
      t.column "key", :string, :limit => 50
      t.column "value", :string
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "updated_by", :integer
      t.column "updated_at", :datetime
    end

    create_table "shopping_cart_items" do |t|
      t.column "shopping_cart_id", :integer, :default => 0, :null => false
      t.column "item_id", :integer, :default => 0, :null => false
      t.column "quantity", :float, :default => 0.0, :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "shopping_carts" do |t|
      t.column "user_id", :integer, :default => 0, :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "suppliers" do |t|
      t.column "name", :string, :limit => 100, :default => "", :null => false
      t.column "corporate_url", :string
      t.column "storefront_url", :string
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "parent_id", :integer
      t.column "primary_contact_id", :integer
      t.column "primary_address_id", :integer
    end

    create_table "taggings" do |t|
      t.column "tag_id", :integer
      t.column "taggable_id", :integer
      t.column "taggable_type", :string, :limit => 50
      t.column "created_by", :integer
      t.column "created_at", :datetime
      t.column "is_private", :boolean, :default => false
    end

    create_table "tags" do |t|
      t.column "name", :string, :limit => 30, :default => "", :null => false
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    add_index "tags", ["name"], :name => "tags_name_index"

    create_table "tasks" do |t|
      t.column "project_id", :integer
      t.column "name", :string, :limit => 100
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
    end

    create_table "uoms" do |t|
      t.column "code", :string, :limit => 6, :default => "", :null => false
      t.column "name", :string, :limit => 100, :default => "", :null => false
      t.column "allowable_precision", :integer
    end

    create_table "widgets" do |t|
      t.column "form_id", :integer
      t.column "type", :string, :limit => 50
      t.column "label", :string, :limit => 100
      t.column "parent_id", :integer
      t.column "created_by", :integer
      t.column "updated_by", :integer
      t.column "created_at", :datetime
      t.column "updated_at", :datetime
      t.column "position", :integer
      t.column "value", :text
      t.column "max_length", :integer
      t.column "rows", :integer
      t.column "cols", :integer
      t.column "is_selected", :boolean
      t.column "date_value", :datetime
      t.column "name", :string, :limit => 50
      t.column "hint", :string, :limit => 50
      t.column "is_required", :boolean
    end
  end
  
  def self.down
    drop_table "account_allocations"
    drop_table "account_field_types"
    drop_table "account_types"
    drop_table "accounts"
    drop_table "address_assignments"
    drop_table "addresses"
    drop_table "approval_limits"
    drop_table "approvals"
    drop_table "ask_answers"
    drop_table "ask_categories"
    drop_table "ask_moderators"
    drop_table "ask_questions"
    drop_table "ask_subscriptions"
    drop_table "attachment_links"
    drop_table "attachments"
    drop_table "catalog_attributes"
    drop_table "catalog_categories"
    drop_table "catalog_headers"
    drop_table "catalog_item_attribute_values"
    drop_table "catalog_item_attributes"
    drop_table "catalog_item_categories"
    drop_table "catalog_items"
    drop_table "contacts"
    drop_table "contracts"
    drop_table "countries"
    drop_table "currencies"
    drop_table "data_sources"
    drop_table "feeds"
    drop_table "form_responses"
    drop_table "forms"
    drop_table "languages"
    drop_table "notifications"
    drop_table "objections"
    drop_table "order_headers"
    drop_table "order_lines"
    drop_table "organizations"
    drop_table "organizations_users"
    drop_table "policies"
    drop_table "product_reviews"
    drop_table "projects"
    drop_table "punchin_sessions"
    drop_table "punchout_sessions"
    drop_table "punchout_sites"
    drop_table "requisition_event_history"
    drop_table "requisition_headers"
    drop_table "requisition_line_templates"
    drop_table "requisition_lines"
    drop_table "setup"
    drop_table "shopping_cart_items"
    drop_table "shopping_carts"
    drop_table "suppliers"
    drop_table "taggings"
    drop_table "tags"
    drop_table "tasks"
    drop_table "uoms"
    drop_table "widgets"
  end
end
