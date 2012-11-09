Meteor Router
===================================

The Meteor Router builds on [page.js](https://github.com/tmeasday/meteor-page-js) to build a reactive, filtering router for Meteor apps.

### Router API

#### Basics

To find the current page:
```js
Meteor.Router.page();
```

This is a reactive variable which will trigger invalidations as the app changes pages. Usually, you'll just want to render the template that corresponds to the current page:

```handlebars
<!-- this will render the 'news' template in the current example -->
{{renderPage}}
```

To define a route, simply specify the URL it matches and the name of the template it should render. If you want to get fancy, you can specify a reactive function that returns a template name. It will get repeatedly executed as its reactive dependencies change.
```js
Meteor.Router.add({
  '/news': 'news',
  
  '/about': function() {
    if (Session.get('aboutUs')) {
      return 'aboutUs';
    } else {
      return 'aboutThem';
    }
  }
});
```

To navigate to such a URL from in the app, either create a link which links to the URL (the router will intercept clicks and trigger relevant state changes), or call directly:

```js
Meteor.Router.to('/news');
```

*NOTE* that this doesn't reload the app, it instead uses HTML5 `pushState` to change the URL whilst remaining loaded.

#### Route Matches

When the route function is called, `this` corresponds to a page.js [`Context`](https://github.com/visionmedia/page.js#contextcanonicalpath), allowing you to do the following:

```js
Meteor.Router.add({
  'posts/:id': function(id) {
     console.log('we are at ' + this.canonicalPath);
     console.log("our parameters: " + this.params);

     // access parameters in order a function args too
     Session.set('currentPostId', id);
     return 'showPost';
  }
});
```

#### Filtering

The current system of filtering in this package is the equivalent of an `after_filter` in Rails. To add a filter which will render the correct template for a page which requires login:

```js
Meteor.Router.filters({
  'checkLoggedIn': function(page) {
    if (Meteor.user()) {
      if (Meteor.user().loading) {
        return 'loading';
      } else {
        return page;
      }
    } else {
      return 'signin';
    }
  });
});
```

To turn the filter on, use one of:

```js
// applies to all pages
Meteor.Router.filter('checkLoggedIn');

// applies to specific pages
Meteor.Router.filter('checkLoggedIn', {only: 'profile'});
Meteor.Router.filter('checkLoggedIn', {except: 'home'});
```

Note that filters build on reactivity. So the URL will not change but the user will see different pages as the state of the `Meteor.user()` property changes.

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

