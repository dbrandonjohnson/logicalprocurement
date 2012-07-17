# HumanAttributeOverride

module ActiveRecord
  class Base
    class <<self
      # Allows alternate humanized versions of attributes to be set.  For example, an attribute such as 'num_employees' would be
      # converted to 'Num employees' normally using <tt>human_attribute_name</tt>.  More descriptive text can be set. Example:
      #   attr_human_name 'num_employees' => 'Number of employees'
      def attr_human_name(attributes) # :nodoc:
        write_inheritable_hash("attr_human_name", attributes || {})
      end

      # Returns a hash of alternate human name conversions set with <tt>attr_human_name</tt>.
      def human_name_attributes # :nodoc:
        read_inheritable_attribute("attr_human_name")
      end

      # Transforms attribute key names into a more humane format, such as "First name" instead of "first_name". Example:
      #   Person.human_attribute_name("first_name") # => "First name"
      def human_attribute_name(attribute_key_name) #:nodoc:
        (read_inheritable_attribute("attr_human_name") || {})[attribute_key_name] || attribute_key_name.humanize
      end
    end
  end

  module ConnectionAdapters #:nodoc:
    # An abstract definition of a column in a table.
    class Column
      def human_name
        Base.human_attribute_name(@name)
      end
    end
  end

  class Errors
    # Returns all the full error messages in an array.
    def full_messages
      full_messages = []

      @errors.each_key do |attr|
        @errors[attr].each do |msg|
          next if msg.nil?

          if attr == "base"
            full_messages << msg
          else
            full_messages << @base.class.human_attribute_name(attr) + " " + msg
          end
        end
      end
      
      full_messages
    end
  end
end
