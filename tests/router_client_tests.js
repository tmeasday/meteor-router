Tinytest.add("Router page", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/foo': 'foo',
    '/bar/:id': function(id) {
      Session.set('id', id);
      return 'bar';
    }
  });
  Meteor.Router.add(/page\/(\d+)/, function(number) {
    Session.set('pageNo', number);
    return 'page';
  });
  
  test.equal(Meteor.Router.page(), null);
  
  Meteor.Router.to('/foo');
  test.equal(Meteor.Router.page(), 'foo');
  
  Meteor.Router.to('/bar/1');
  test.equal(Meteor.Router.page(), 'bar');
  test.equal(Session.get('id'), '1');
  
  Meteor.Router.to('/page/7');
  test.equal(Meteor.Router.page(), 'page');
  test.equal(Session.get('pageNo'), '7');
});

Tinytest.add("Router reactivity", function(test) {
  var context_called = 0;
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/foo': 'foo',
    '/bar': 'bar',
    '/bar/2': function() {
      // do something unrelated
      Session.set('router-test-page', 2);
      return 'bar';
    }
  })
  
  Meteor.autorun(function() {
    Meteor.Router.page();
    context_called += 1;
  });
  
  test.equal(context_called, 1);
  
  Meteor.Router.to('/foo')
  Meteor.flush()
  test.equal(context_called, 2);
  
  Meteor.Router.to('/bar')
  Meteor.flush()
  test.equal(context_called, 3);
  
  // returns 'bar' to shouldn't trigger reactivity
  Meteor.Router.to('/bar/2')
  Meteor.flush()
  test.equal(context_called, 3);
});

Tinytest.add("Router filtering", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/foo': 'foo',
    '/bar': 'bar',
    '/baz': 'baz'
  })
  
  Meteor.Router.filters({
    'something_else': function() { return 'something_else'; },
    'third': function() { return 'a third thing' }
  })
  Meteor.Router.filter('something_else', {only: 'foo'});
  Meteor.Router.filter('third', {except: ['something_else', 'baz']});
  
  Meteor.Router.to('/foo');
  test.equal(Meteor.Router.page(), 'something_else');
  
  Meteor.Router.to('/bar');
  test.equal(Meteor.Router.page(), 'a third thing');
  
  Meteor.Router.to('/baz');
  test.equal(Meteor.Router.page(), 'baz');
});

Tinytest.add("FilteredRouter filter reactivity", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add('/foo', 'foo');
  
  Meteor.Router.filters({
    'something_else': function(page) {
      if (Session.get('something_else')) {
        return 'something_else';
      } else {
        return page;
      }
    }
  });
  Meteor.Router.filter('something_else');
  
  Session.set('something_else', null);
  Meteor.flush();
  Meteor.Router.to('/foo');
  test.equal(Meteor.Router.page(), 'foo');
  
  Session.set('something_else', true);
  Meteor.flush();
  test.equal(Meteor.Router.page(), 'something_else');
});

Tinytest.add("Router named route helpers", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add('/named/:arg', 'named');
  
  test.equal(Meteor.Router.namedPath({arg: 7}), '/named/7');
  test.equal(Meteor.Router.namedUrl(7), Meteor.absoluteUrl('named/7'));
  
  Meteor.Router.to('named', {arg: 7});
  Meteor.flush();
  test.equal(Meteor.Router.page(), 'named');
});

Tinytest.add("Router different argument formats", function(test) {
  Meteor.Router.resetFilters();
  Meteor.Router.add({
    '/route1': 'page1',
    '/route2': function() { return 'page2'; },
    '/route3': {to: 'page3', and: function() { Session.set('foo', 'page3'); }},
    '/route4': {to: 'page4', as: 'route4'},
  });
  
  // simple one
  Meteor.Router.to('page1');
  Meteor.flush();
  test.equal(Meteor.Router.page(), 'page1');
  
  // no named route exists
  test.throws(function() {
    Meteor.Router.to('page2');
  })
  
  // slightly more complex
  Meteor.Router.to('page3');
  Meteor.flush();
  test.equal(Meteor.Router.page(), 'page3');
  test.equal(Session.get('foo'), 'page3');
  
  test.throws(function() {
    Meteor.Router.to('page4');
  });
  test.equal(Meteor.Router.route4Path(), '/route4');
  Meteor.Router.to('route4');
  Meteor.flush();
  test.equal(Meteor.Router.page(), 'page4');
});

Tinytest.add("Router before routing", function(test) {
  var beforeCalled = false;
  
  Meteor.Router.resetFilters();
  Meteor.Router.add('/before', 'before');
  Meteor.Router.beforeRouting = function() {
    beforeCalled = true;
  }
  
  test.equal(beforeCalled, false);
  Meteor.Router.to('/before');
  test.equal(beforeCalled, true);
});

Tinytest.add("Router before routing interrupt", function(test) {
  var beforeCalled = false;
  
  Meteor.Router.resetFilters();
  
  Meteor.Router.beforeRouting = function() {
	// a method (i.e. returns undefined) should not interrupt routing 
  }

  Meteor.Router.to('/route1');
  Meteor.flush();
  test.equal(Meteor.Router.page(), 'page1');
  
  Meteor.Router.beforeRouting = function() {
	// returning false should interrupt (block) routing
	return false;
  }

  Meteor.Router.to('/route2');
  test.equal(Meteor.Router.page(), 'page1');
});