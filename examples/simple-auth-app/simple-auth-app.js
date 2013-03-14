if (Meteor.isClient) {
  Meteor.Router.add({
    '/': 'home'
  });

  Meteor.Router.filters({
    requireLogin: function(page) {
      if (Meteor.loggingIn()) {
        return 'loading';
      } else if (Meteor.user()) {
        return page;
      } else {
        return 'login';
      }
    }
  });

  Meteor.Router.filter('requireLogin')
}