if (Meteor.is_client) {
  Meteor.Router.add({
    '/': 'home',
    '/welcome': 'welcome'
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
    'click .logout': function(e) {
      e.preventDefault();
      Session.set('username', false);
    }
  }

}
