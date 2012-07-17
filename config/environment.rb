# Be sure to restart your web server when you modify this file.

# Uncomment below to force Rails into production mode when 
# you don't control web/app server and can't set it the proper way
# ENV['RAILS_ENV'] ||= 'production'

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '1.2.3'

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

# Add acts_as_ferret support
require 'acts_as_ferret'

# Add deprecated config support for login_engine and user_engine
require File.join(RAILS_ROOT, "vendor", "plugins", "engines", "lib", "engines", "deprecated_config_support")

Rails::Initializer.run do |config|
  # Settings in config/environments/* take precedence those specified here
  
  # Skip frameworks you're not going to use
  # config.frameworks -= [ :action_web_service, :action_mailer ]

  # Add additional load paths for your own custom dirs
  # config.load_paths += %W( #{RAILS_ROOT}/extras )

  # Force all environments to use the same logger level 
  # (by default production uses :info, the others :debug)
  # config.log_level = :debug

  # Use the database for sessions instead of the file system
  # (create the session table with 'rake create_sessions_table')
  config.action_controller.session_store = :active_record_store

  # Enable page/fragment caching by setting a file-based store
  # (remember to create the caching directory and make it readable to the application)
  # config.action_controller.fragment_cache_store = :file_store, "#{RAILS_ROOT}/cache"

  # Activate observers that should always be running
  # config.active_record.observers = :cacher, :garbage_collector

  # Make Active Record use UTC-base instead of local time
  config.active_record.default_timezone = :utc

  # Match everybody else's timezone to the rails timezone
  ENV['TZ'] = config.active_record.default_timezone.to_s
  
  # Use Active Record's schema dumper instead of SQL when creating the test database
  # (enables use of different database adapters for development and test environments)
  # config.active_record.schema_format = :ruby

  # See Rails::Configuration for more options
  
  config.plugins = %w(engines login_engine user_engine active-form acts_as_state_machine acts_as_taggable acts_as_versioned file_column coupa_engine *)
end

# Add new inflection rules using the following format 
# (all these examples are active by default):
# Inflector.inflections do |inflect|
#   inflect.plural /^(ox)$/i, '\1en'
#   inflect.singular /^(ox)en/i, '\1'
#   inflect.irregular 'person', 'people'
#   inflect.uncountable %w( fish sheep )
# end


# Include your application configuration below
module Engines
  config :root, RAILS_ROOT + "/vendor/plugins"
end

module LoginEngine
  config :salt, "And-hast-though-slain-the-Jabberwock?", :force
  config :app_url, 'http://localhost:3000/', :force
  config :app_name, 'Coupa', :force
  config :changeable_fields, [ 'firstname', 'lastname', 'email', 'approval_limit_id', 'default_currency_id', 'default_account_id', 'manager_id', 'phone_work', 'phone_mobile' ], :force
  config :use_email_notification, false, :force
end

module UserEngine
  config :admin_login, "williams", :force
  config :admin_password, "welcome", :force
  config :admin_email, "coupademodata1@gmail.com", :force
end

require 'action_view_pdf'
ActionView::Base.register_template_handler 'rpdf', ActionView::PDFRender

require 'action_controller/mailer_controller'
ActionController::MailerController.default_settings = {
  :host => 'localhost',
  :port => 3000
}

#
# Uncomment the settings below to get outgoing emails working
#
# ActionMailer::Base.smtp_settings = {
#   :address => "localhost",
#   :port => 25,
#   :domain => "localhost"
# }

#
# Uncomment the settings below to authenticate against Active Directory
# 
# require_gem 'activedirectory'
# ActiveDirectory::Base.logger = RAILS_DEFAULT_LOGGER
# ActiveDirectory::Base.server_settings = {
#   :host     => "directory.example.com",
#   :port     => 389,
#   :username => "username",
#   :password => "password",
#   :domain   => "example.com",
#   :base_dn  => "DC=example,DC=com"
# }
