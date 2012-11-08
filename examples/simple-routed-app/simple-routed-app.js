if (Meteor.is_client) {
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

  Meteor.Router.filter('requireLogin', {only: 'welcome'})

  Template.sign_in.events = {
    'submit form': function(e) {
      e.preventDefault();
      Session.set('username', $(e.target).find('[name=username]').val())
    }
  }

  Template.welcome.username = function() { return Session.get('username'); }
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
  }

  Template.post.helpers({
    id: function() { return Session.get('postId'); }
  })
}
