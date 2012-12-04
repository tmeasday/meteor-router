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


Tinytest.add("Router.serve change headers", function(test) {
  Meteor.Router.add('/baz', function() {
    this.response.setHeader('x-my-header', 'Baz');
    return 'data';
  })
  
  var resp = Meteor.http.get('http://localhost:3000/baz')
  test.equal(resp.content, 'data');
  test.equal(resp.headers['x-my-header'], 'Baz');
});

