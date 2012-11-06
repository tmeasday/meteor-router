(function() {
  var Router = function() {
    this._page = null;
    this._autorunHandle = null;
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
      self._page = pageFn.call(context);
      self.listeners.invalidateAll();
    })
  }
  
  Router.prototype.add = function(routesMap) {
    var self = this;
    
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
  
  
  Meteor.Router = new Router();
  Meteor.startup(function() {
    page();
  });
}());