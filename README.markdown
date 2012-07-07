Meteor Reactive + Filtering Routers
-----------------------------------

_NOTE: this library requires the deps-extension package[https://github.com/meteor/meteor/pull/193]. Read more about it here: http://bindle.me/blog/index.php/679/page-transitions-in-meteor-getleague-com_

A `ReactiveRouter` is a simple beast, it's just a Backbone Router with a reactive variable `current_page()`. To set the variable, call `goto()`.

```js
MyRouter = ReactiveRouter.extend({
  routes: {'': 'home'},
  home: function() { this.goto('home'); }
})

Router = new MyRouter();
Meteor.startup(function() {
  Backbone.history.start();
  Router.current_page(); // might be 'home'
})
```

A `FilteredRouter` adds filtering capabilities to the string returned by `current_page`. For instance, you could hook into the new Meteor Auth[https://github.com/meteor/meteor/wiki/Getting-started-with-Auth] stuff like so:

```js
MyRouter = FilteredRouter.extend({
  initialize: function() {
    FilteredRouter.prototype.initialize.call(this);
    this.filter(this.require_login, {only: ['home']});
  },
  
  require_login: function(page) {
    if (Meteor.user()) {
      return page;
    } else {
      return 'signin';
    }
  },
  
  routes: {'': 'home'},
  home: function() { this.goto('home'); }
})

Router = new MyRouter();
Meteor.startup(function() {
  Backbone.history.start();
  Router.current_page(); // might be 'home' or 'signin'
})
```

