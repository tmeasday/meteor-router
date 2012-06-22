// Simply a backbone router with a single added function
// goto() which can be called with either
//   a) a page name
//   b) a function that returns a page name
//
// A ReactiveRouter has a reactive variable .current_page() that returns the result 
// whatever is set via goto().
ReactiveRouter = Backbone.Router.extend({
  initialize: function() {
    Meteor.deps.add_reactive_variable(this, 'current_page', 'loading');
    Backbone.Router.prototype.initialize.call(this);
  },
  
  // simply wrap a page generating function in a context so we can set current_page
  // every time that it changes, but we can ensure that we only call it once (in case of side-effects) 
  // TODO -- either generalize this pattern or get rid of it
  goto: function(page_f) {
    var self = this;
    
    // so there's no need to specify constant functions
    if (typeof(page_f) !== 'function') {
      var copy = page_f;
      page_f = function() { return copy; }
    }
    
    var context = new Meteor.deps.Context();
    context.on_invalidate(function() {
      self.goto(page_f);
    });
    
    context.run(function() {
      self.current_page.set(page_f())
    });
  }
});

// A FilteredRouter is a ReactiveRouter with an API for filtering.
//
// call Router.filter(fn, options)
//
// to wrap all goto() calls in fn, assuming options fit, where options are:
//   - only: array of names that fn should be called for
//   - except: array of names that fn should not be called for.
FilteredRouter = ReactiveRouter.extend({
  initialize: function() {
    this._filters = [];
    ReactiveRouter.prototype.initialize.call(this);
  },
  
  // normal goto, but runs the output of page_f through the filters
  goto: function(page_f) {
    var self = this;
    
    // so there's no need to specify constant functions
    if (typeof(page_f) !== 'function') {
      var copy = page_f;
      page_f = function() { return copy; }
    }
    
    ReactiveRouter.prototype.goto.call(this, function() {
      return self.apply_filters(page_f());
    });
  },
  
  // set up a filter
  filter: function(fn, options) {
    if (options === undefined)
      options = {}
    options.fn = fn;
    
    this._filters.push(options);
  },
  
  // run all filters over page
  apply_filters: function(page) {
    var self = this;
    return _.reduce(self._filters, function(page, filter) {
      return self.apply_filter(page, filter)
    }, page);
  },
  
  // run a single filter (check only and except)
  apply_filter: function(page, filter) {
    var apply = true;
    if (filter.only) {
      apply = _.include(filter.only, page);
    } else if (filter.except) {
      apply = !_.include(filter.except, page);
    }
          
    if (apply) {
      return filter.fn(page);
    } else {
      return page;
    }
  }
});