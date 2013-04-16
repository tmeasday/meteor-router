if (Meteor.is_client) {
  Meteor.startup(function() {
    // so you can know if you've successfully in-browser browsed
    console.log('Started at ' + location.href);
  });

  Meteor.Router.add({
    '/': 'home',

    '/welcome': 'welcome',

    '/posts/:id': function(id) {
      Session.set('postId', id);
      return 'post';
    }
  });

  Meteor.Router.filters({
    requireLogin: function(page) {
      var username = Session.get('username');
      if (username) {
        return page;
      } else {
        return 'sign_in';
      }
    }
  });

  Meteor.Router.filter('requireLogin', {only: 'welcome'});

  Template.sign_in.events = {
    'submit form': function(e) {
      e.preventDefault();
      Session.set('username', $(e.target).find('[name=username]').val());
    }
  };

  Template.welcome.username = function() { return Session.get('username'); };

  Template.welcome.events = {

    'submit form': function(event, template) {
      event.preventDefault();
      var postName = template.find('#post_name').value;  // simpler, no jQuery
      // programmatic routing, using pushState()
      Meteor.Router.to('/posts/' + postName);
     },

    'click .logout': function(e) {
      e.preventDefault();
      Session.set('username', false);
    }
  };

  Template.post.helpers({
    id: function() { return Session.get('postId'); }
  });
}

if (Meteor.isServer) {
  Meteor.Router.add({
    '/test-endpoint': 'SOME DATA!',
    '/second-test-endpoint': function() {
      console.log(this.request.body);
      return 'foo';
    }
  });

  Meteor.Router.add({
    '/posts/:id.xml': function(id) {
      return Posts.findOne(id).foo;
    }
  });

  // don't actually publish this
  var Posts = new Meteor.Collection('posts');
  Meteor.startup(function() {
    if (Posts.find().count() === 0) {
      console.log('added Post: ' + Posts.insert({foo: 'bar'}));
    }
  });
}