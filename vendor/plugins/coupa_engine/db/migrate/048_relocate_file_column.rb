class RelocateFileColumn < ActiveRecord::Migration
  OLD_PATH = File.join(RAILS_ROOT, 'public')
  NEW_PATH = FileColumn::ClassMethods::DEFAULT_OPTIONS[:root_path]
  
  def self.up
    move_file_column_dirs(OLD_PATH, NEW_PATH)
  end
  
  def self.down
    move_file_column_dirs(NEW_PATH, OLD_PATH)
  end

  def self.move_file_column_dirs(from, to)
    require 'enumerator'
    
    return if File.expand_path(from) == File.expand_path(to)
    return unless File.directory?(from)
    
    FileUtils.mkpath(to) unless File.directory?(to)
    Dir.entries(from).select { |d|
      begin
        d.camelize.constantize.ancestors.include?(FileColumn)
      rescue NameError
        false
      end
    }.each { |d| FileUtils.mv(File.join(from, d), File.join(to, d)) }
  end
end