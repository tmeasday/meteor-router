Tinytest.add("Route basics", function(test) {
  var route = new Meteor.Router.Route('/posts/:_id');
  
  var params = {};
  test.equal(route.match('/posts/7', null, params), true);
  test.equal(params._id, '7');
  
  params = {};
  test.equal(route.match('/posts/', null, params), false);
  test.equal(params, {});
  
  test.equal(route.pathWithContext({_id: 10}), '/posts/10');
  test.equal(route.pathWithContext(10), '/posts/10');
});