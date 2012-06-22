Tinytest.add("ReactiveRouter current_page", function(test) {
  var router = new ReactiveRouter();
  
  test.equal(router.current_page(), 'loading');
  
  router.goto('foo');
  test.equal(router.current_page(), 'foo');
  
  router.goto(function() { 
    return 'bar';
  });
  test.equal(router.current_page(), 'bar');
});

Tinytest.add("ReactiveRouter reactivity", function(test) {
  var context_called = 0;
  var router = new ReactiveRouter();
  var page = router.current_page();
  Meteor.deps.await(function() { return router.current_page() != page; }, function() {
    page = router.current_page();
    context_called += 1;
  });
  
  test.equal(context_called, 0);
  
  router.goto('foo');
  Meteor.flush()
  test.equal(context_called, 1);
  
  router.goto('bar');
  Meteor.flush()
  test.equal(context_called, 2);
});

Tinytest.add("FilteredRouter filter options", function(test) {
  var router = new FilteredRouter();
  router.filter(function(page) { return 'something_else'; }, {only: ['foo']});
  router.filter(function(page) { return 'a third thing'; }, {except: ['something_else', 'baz']});
  
  router.goto('foo')
  test.equal(router.current_page(), 'something_else');
  
  router.goto('bar')
  test.equal(router.current_page(), 'a third thing');
  
  router.goto('baz')
  test.equal(router.current_page(), 'baz');
});

Tinytest.add("FilteredRouter filter reactivity", function(test) {
  var router = new FilteredRouter();
  var reactive = {};
  Meteor.deps.add_reactive_variable(reactive, 'variable', false);
  
  router.filter(function(page) {
    if (reactive.variable()) {
      return page;
    } else {
      return 'something_else';
    }
  });
  
  router.goto('foo')
  test.equal(router.current_page(), 'something_else');
  
  reactive.variable.set(true);
  Meteor.flush();
  test.equal(router.current_page(), 'foo');
});