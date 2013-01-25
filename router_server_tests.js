// XXX: is it OK to assume localhost:3000 here? 
//
// it seems that stream does in it's tests.
Tinytest.add("Simple Router.serve", function(test) {
  Meteor.Router.add('/server/foo', function() {
    return 'data';
  });
  
  Meteor.Router.add(/server\/page\/(\d+)/, function(number) {
    return [number, 'page'];
  });
  
  var resp = Meteor.http.get('http://localhost:3000/server/foo')
  test.equal(resp.content, 'data');
  
  var resp = Meteor.http.get('http://localhost:3000/server/page/7')
  test.equal(resp.statusCode, 7);
  test.equal(resp.content, 'page');
});

Tinytest.add("Router.serve with params", function(test) {
  Meteor.Router.add('/server/bar/:id.xml', function(id) {
    return id;
  })
  
  var resp = Meteor.http.get('http://localhost:3000/server/bar/content.xml')
  test.equal(resp.content, 'content');
});


Tinytest.add("Router.serve various response types", function(test) {
  Meteor.Router.add({
    '/server/baz-1': [404, {'x-my-header': 'Baz'}, 'data'],
    '/server/baz-2': [405, 'data'],
    '/server/baz-3': ['data'],
    '/server/baz-4': 406,
    '/server/baz-5': 'data'
  });
  
  var resp = Meteor.http.get('http://localhost:3000/server/baz-1')
  test.equal(resp.statusCode, 404);
  test.equal(resp.content, 'data');
  test.equal(resp.headers['x-my-header'], 'Baz');
  
  // grab it again to make sure we aren't messing with it
  var resp = Meteor.http.get('http://localhost:3000/server/baz-1')
  test.equal(resp.statusCode, 404);
  test.equal(resp.content, 'data');
  test.equal(resp.headers['x-my-header'], 'Baz');
  
  var resp = Meteor.http.get('http://localhost:3000/server/baz-2')
  test.equal(resp.statusCode, 405);
  test.equal(resp.content, 'data');
  
  var resp = Meteor.http.get('http://localhost:3000/server/baz-3')
  test.equal(resp.content, 'data');
  
  var resp = Meteor.http.get('http://localhost:3000/server/baz-4')
  test.equal(resp.statusCode, 406);
  
  var resp = Meteor.http.get('http://localhost:3000/server/baz-5')
  test.equal(resp.content, 'data');
});


Tinytest.add("Router.serve with futures", function(test) {
  Meteor.Router.add('/server/delayed', function() {
    var Future = __meteor_bootstrap__.require('fibers/future');
    var fut = new Future();
    setTimeout(function() {
      fut.ret('foo-in-timeout');
    }, 1);
        
    return fut.wait();
  });
  
  var resp = Meteor.http.get('http://localhost:3000/server/delayed')
  test.equal(resp.content, 'foo-in-timeout');
});
