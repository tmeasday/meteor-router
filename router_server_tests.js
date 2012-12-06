// XXX: is it OK to assume localhost:3000 here? 
//
// it seems that stream does in it's tests.
Tinytest.add("Simple Router.serve", function(test) {
  Meteor.Router.add('/foo', function() {
    return 'data';
  });
  
  
  var resp = Meteor.http.get('http://localhost:3000/foo')
  test.equal(resp.content, 'data');
});

Tinytest.add("Router.serve with params", function(test) {
  Meteor.Router.add('/bar/:id.xml', function(id) {
    return id;
  })
  
  var resp = Meteor.http.get('http://localhost:3000/bar/content.xml')
  test.equal(resp.content, 'content');
});


Tinytest.add("Router.serve various response types", function(test) {
  Meteor.Router.add({
    '/baz-1': [404, {'x-my-header': 'Baz'}, 'data'],
    '/baz-2': [405, 'data'],
    '/baz-3': ['data'],
    '/baz-4': 406,
    '/baz-5': 'data'
  });
  
  var resp = Meteor.http.get('http://localhost:3000/baz-1')
  test.equal(resp.statusCode, 404);
  test.equal(resp.content, 'data');
  test.equal(resp.headers['x-my-header'], 'Baz');
  
  var resp = Meteor.http.get('http://localhost:3000/baz-2')
  test.equal(resp.statusCode, 405);
  test.equal(resp.content, 'data');
  
  var resp = Meteor.http.get('http://localhost:3000/baz-3')
  test.equal(resp.content, 'data');
  
  var resp = Meteor.http.get('http://localhost:3000/baz-4')
  test.equal(resp.statusCode, 406);
  
  var resp = Meteor.http.get('http://localhost:3000/baz-5')
  test.equal(resp.content, 'data');
});

