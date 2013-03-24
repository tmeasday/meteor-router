if (Meteor.isClient) {
  Meteor.Router.add({
    '/': 'userPage',
    '/admin': 'adminPage'
  })
  
  Template.body.helpers({
    layoutName: function() {
      switch (Meteor.Router.page()) {
        case 'adminPage':
          return 'adminLayout';
        case 'userPage':
          return 'userLayout';
        default:
          return 'userLayout';
      }
    }
  });
}
