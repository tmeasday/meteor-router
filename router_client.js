(function() {
  var Router = function() {
    this._page = null;
    this._autorunHandle = null;
    this._filters = {};
    this._activeFilters = [];
    this.listeners = new Meteor.deps._ContextSet();
  }
  
  // internal, don't use
  Router.prototype._setPageFn = function(pageFn, context) {
    var self = this;
    
    // the current function that generates self._page
    // we could just store pageFn and call it everytime someone
    // calls Meteor.Router.page(), but this would lead to 
    // the routing function getting called multiple times, which could be
    // unexpected if it has side effects. This is essentially a memoize pattern
    self._autorunHandle && self._autorunHandle.stop();
    self._autorunHandle = Meteor.autorun(function() {
      var args = [];
      for (key in context.params)
        args.push(context.params[key]);
      
      var oldPage = self._page;
      self._page = self._applyFilters(pageFn.apply(context, args));
      
      // no need to invalidate if .page() hasn't changed
      (oldPage !== self._page) && self.listeners.invalidateAll();
    })
  }
  
  Router.prototype.add = function(routesMap) {
    var self = this;
    
    if (! _.isObject(routesMap)) {
      var map = {};
      map[routesMap] = arguments[1];
      return self.add(map);
    }
    
    _.each(_.keys(routesMap), function(path) {
      var endpoint = routesMap[path];
      if (! _.isFunction(endpoint)) {
        endpoint = _.bind(_.identity, null, endpoint);
      }
      
      page(path, _.bind(self._setPageFn, self, endpoint));
    });
  }
  
  Router.prototype.page = function() {
    this.listeners.addCurrentContext();
    return this._page;
  }
  
  Router.prototype.to = function(path) {
    page(path);
  }
  
  Router.prototype.filters = function(filtersMap) {
    _.extend(this._filters, filtersMap);
  }
  
  // call with one of:
  // 
  //   Meteor.Router.filter('filter-name'); 
  //     - filter all pages with filter-name
  //   Meteor.Router.filter('filter-name', {only: 'home'});
  //     - filter the 'home' page with filter-name
  //   Meteor.Router.filter('filter-name', {except: ['home']});
  //     - filter all pages except the 'home' page with filter-name
  //   Meteor.Router.filter(object)
  //     -  a map of name: application pairs
  Router.prototype.filter = function(name, options) {
    var self = this;
    
    if (_.isObject(name)) {
      return _.each(name, function(options, key) { 
        self.filter(key, options);
      });
    }
    
    options = options || {};
    options.name = name;
    if (options.only && ! _.isArray(options.only))
      options.only = [options.only];
    if (options.except && ! _.isArray(options.except))
      options.except = [options.except];
    
    self._activeFilters.push(options);
  }
  
  // Shouldn't need to use this, more for testing
  // turn off all filters
  Router.prototype.resetFilters = function() {
    this._activeFilters = [];
  }
  
  // run all filters over page
  Router.prototype._applyFilters = function(page) {
    var self = this;
    return _.reduce(self._activeFilters, function(page, filter) {
      return self._applyFilter(page, filter)
    }, page);
  }
  
  // run a single filter (first check only and except apply)
  Router.prototype._applyFilter = function(page, filter) {
    var apply = true;
    if (filter.only) {
      apply = _.include(filter.only, page);
    } else if (filter.except) {
      apply = ! _.include(filter.except, page);
    }
          
    if (apply) {
      return this._filters[filter.name](page);
    } else {
      return page;
    }
  }
  
  
  Meteor.Router = new Router();
  Meteor.startup(function() { page(); });
}());