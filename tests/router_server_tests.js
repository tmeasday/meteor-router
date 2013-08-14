// XXX: is it OK to assume localhost:3000 here?
//
// it seems that stream does in it's tests.

// Force serving before Meteor fully starts
Meteor.Router._start();

Tinytest.add("Simple Router.serve", function(test) {
  Meteor.Router.add('/server/foo', function() {
    return 'data';
  });

  Meteor.Router.add(/server\/page\/(\d+)/, function(number) {
    return [number, 'page'];
  });

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/foo'));
  test.equal(resp.content, 'data');

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/page/7'));
  test.equal(resp.statusCode, 7);
  test.equal(resp.content, 'page');
});

Tinytest.add("Router.serve with params", function(test) {
  Meteor.Router.add('/server/bar/:id.xml', function(id) {
    return id;
  })

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/bar/content.xml'));
  test.equal(resp.content, 'content');
});


Tinytest.add("Router.serve various response types", function(test) {
  Meteor.Router.add({
    '/server/baz-1': [201, {'x-my-header': 'Baz'}, 'data'],
    '/server/baz-2': [202, 'data'],
    '/server/baz-3': ['data'],
    '/server/baz-4': 203,
    '/server/baz-5': 'data'
  });

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-1'));
  test.equal(resp.statusCode, 201);
  test.equal(resp.content, 'data');
  test.equal(resp.headers['x-my-header'], 'Baz');

  // grab it again to make sure we aren't messing with it
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-1'));
  test.equal(resp.statusCode, 201);
  test.equal(resp.content, 'data');
  test.equal(resp.headers['x-my-header'], 'Baz');

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-2'));
  test.equal(resp.statusCode, 202);
  test.equal(resp.content, 'data');

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-3'));
  test.equal(resp.content, 'data');

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-4'));
  test.equal(resp.statusCode, 203);

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-5'));
  test.equal(resp.content, 'data');
});


Tinytest.add("Router.serve with futures", function(test) {
  Meteor.Router.add('/server/delayed', function() {
    var Future = (typeof(Npm) == "undefined") ? __meteor_bootstrap__.require("fibers/future") : Npm.require("fibers/future");
    var fut = new Future();
    setTimeout(function() {
      fut.return('foo-in-timeout');
    }, 1);

    return fut.wait();
  });

  var resp = Meteor.http.get(Meteor.absoluteUrl('server/delayed'));
  test.equal(resp.content, 'foo-in-timeout');
});


Tinytest.add("Router.serve without http method restriction", function(test) {
  Meteor.Router.add('/bat-1', 'data');
  var resp = Meteor.http.get(Meteor.absoluteUrl('bat-1'));
  test.equal(resp.content, 'data');
  var resp = Meteor.http.post(Meteor.absoluteUrl('bat-1'));
  test.equal(resp.content, 'data');
});


Tinytest.add("Router.serve with http method restriction", function(test) {
  Meteor.Router.add('/bat-2', 'GET', 'data');
  Meteor.Router.add('/bat-2', 'POST', 'postdata');
  var resp = Meteor.http.get(Meteor.absoluteUrl('bat-2'));
  test.equal(resp.content, 'data');
  var resp = Meteor.http.post(Meteor.absoluteUrl('bat-2'));
  test.equal(resp.content, 'postdata');
  var resp = Meteor.http.put(Meteor.absoluteUrl('bat-2'));
  test.notEqual(resp.content, 'postdata');
  test.notEqual(resp.content, 'data');
});
