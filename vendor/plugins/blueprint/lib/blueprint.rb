# Blueprint
module Blueprint
	class Node
	  class BlockEnvironment
      class << self
        def run(block, parent, passed_attr)
          self.new(block, parent, passed_attr).nodes
        end
      end
      
      attr_reader :nodes
      
      def initialize(block, parent, passed_attr)
        @nodes = []
        @parent = parent
        instance_exec parent[passed_attr] || parent, &block
      end
      
      def method_missing(method_id, *args, &block)
        singular_method = method_id.to_s.singularize
        if singular_method == method_id.to_s
          node args[0], args[1] || {}, method_id, &block
        else
          for n in args[0]
            self.send(singular_method, n, args[1] || {}, &block)
          end
        end
      end
      
      def node(name, attributes = {}, type = :node, passed_attr = nil, &block)
        @nodes << Blueprint::Node.new(name, attributes, type, passed_attr, @parent, &block)
      end
      
      def item(item, attributes = {}, &block)
        attributes[:item] = item
        attributes[:key] ||= :to_param # gets the id if an active record
        node(
          (item.respond_to?(attributes[:key]) ? item.send(attributes[:key]) : item).to_s, 
          attributes, 
          item.class.name.split('::').last.downcase.to_sym, 
          :item, 
          &block
        )
      end
    end
    
	  include Enumerable

    attr_reader :type
    attr_reader :parent
    attr_writer :name

    def initialize(name, attributes = {}, type = :node, passed_attr = nil, parent = nil, &block)
      raise "Nodes can not have '/' in their name" if name.include? '/'
      @name, @attributes, @type = name, attributes, type
      @passed_attr, @parent, @children_block = passed_attr, parent, block
    end
    
    def method_missing(method)
      return nil unless children_cache = children
      children_of_type = children_cache.find_all{|c| c.type == method } # might not be used, but whatev
      children_cache.find{|c| c.name.to_sym == method } || 
        (children_of_type.empty? ? nil : make_object_proxy(children_of_type))
    end
    
    def get(path)
      path = path.to_s
      unless path.include? '/'
        method_missing(path.to_sym)
      else
        path = path.split('/')
        if path.first.empty?
          node = root 
          path.shift
        else
          node = self
        end
        for part in path
          unless part.include? ':'
            node = node.get(part)
          else
            part = part.split(':')
            node = node.get(part.first)[part.last]
          end
          break unless node
        end
        node
      end
    end
    
    def absolute_path(explicit_type = true, relative_to = nil)
      path = '/' + ancestors.collect{ |a| 
        a.type != :node && explicit_type ? a.type.to_s + ':' + a.name : a.name 
      }.join('/')
      relative_to ? path.gsub(relative_to.absolute_path(explicit_type) + '/', '') : path
    end
    
    def children
      @children_block ? BlockEnvironment.run(@children_block, self, @passed_attr) : []
    end
    
    def each
      children.each{|c| yield c }
    end
    
    def [](attribute)
      @attributes[attribute]
    end
    
    def []=(attribute, value)
      @attributes[attribute] = value
    end
    
    def name
      @name.downcase.gsub(' ', '_').gsub(/[^A-Za-z0-9_-]/, '')
    end
    
    def type=(value)
      @type = value.to_sym
    end
    
    def to_s
      @passed_attr ? self[@passed_attr].to_s : @name
    end
    
    def define(&block)
      @children_block = block
    end
    
    protected
      
      def ancestors
        ancestors = []
        node = self
        begin
          ancestors << node
          node = node.parent
        end until node.nil?
        @root = ancestors.pop
        ancestors.reverse
      end

      def root
        ancestors
        @root
      end
      
      def make_object_proxy(children_of_type)
        o = Object.new
        o.instance_variable_set(:@children, children_of_type)
        o.instance_eval do
          def [](name)
            @children.find{|c| c.name == name.to_s }
          end
          self
        end
      end
  end
  
  class Container
    include Reloadable::Subclasses
    
    class_inheritable_accessor :root
    
    class << self       
      def define(&block)
        (self.root ||= Blueprint::Node.new('root')).define(&block)
      end
      
      def method_missing(method)
        self.root.send(method)
      end
    end
  end
  
end


class Object
  module InstanceExecHelper; end
  include InstanceExecHelper
  def instance_exec(*args, &block)
    begin
      old_critical, Thread.critical = Thread.critical, true
      n = 0
      n += 1 while respond_to?(mname="__instance_exec#{n}")
      InstanceExecHelper.module_eval{ define_method(mname, &block) }
    ensure
      Thread.critical = old_critical
    end
    begin
      ret = send(mname, *args)
    ensure
      InstanceExecHelper.module_eval{ remove_method(mname) } rescue nil
    end
    ret
  end
end