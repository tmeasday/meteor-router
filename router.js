(function() {
  var Router = function() {
    this._page = null;
    this.listeners = new Meteor.deps._ContextSet();
  }
  
  Router.prototype.add = function(routesMap) {
    var self = this;
    
    _.each(_.keys(routesMap), function(path) {
      var endpoint = routesMap[path];
      
      page(path, function() {
        _.isFunction(endpoint) && (endpoint = endpoint());
        
        self._page = endpoint;
        self.listeners.invalidateAll();
      });
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