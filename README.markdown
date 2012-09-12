Meteor Reactive + Filtering Routers
===================================
Using
-----

### ReactiveRouter

A `ReactiveRouter` is a simple beast, it's just a [Backbone Router](http://backbonejs.org/#Router) with a reactive variable `current_page()`. To set the variable, call `goto()`.

```js
MyRouter = ReactiveRouter.extend({
  routes: {'': 'home'},
  home: function() { this.goto('home'); }
})

Router = new MyRouter();
Meteor.startup(function() {
  Backbone.history.start({pushState: true});
})
```

### Templates

To actually use current page, the package provides two handlebars helpers to allow the following:

```handlebars
<html>
  {{{render currentPage}}}
</html>

<!-- This will render if Router.current_page == 'home' -->
<template name="home">
  <h1>Welcome!</h1>
</template>
```

### FilteredRouter

A `FilteredRouter` adds filtering capabilities to the string returned by `current_page`. For instance, you could hook into the new [Meteor Auth](https://github.com/meteor/meteor/wiki/Getting-started-with-Auth) stuff like so:

```js
MyRouter = FilteredRouter.extend({
  initialize: function() {
    FilteredRouter.prototype.initialize.call(this);
    this.filter(this.require_login, {only: ['home']});
  },
  
  require_login: function(page) {
    if (!Meteor.user()) {
      return 'signin';
    } else if (Meteor.user().loading)
      return 'loading';
    } else {
      return page;
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

###Examples

Check out `examples/simple-routed-app` for an extremely simple example of a filtered routed app. (To run, use meteorite: `cd examples/simple-routed-app; mrt run`).

Additionally, you might want to read [my blog post](http://bindle.me/blog/index.php/679/page-transitions-in-meteor-getleague-com) about transitions in Meteor.

Installing
----------

Use [meteorite](http://possibilities.github.com/meteorite/):

Then add via:

```bash
mrt add router
```

