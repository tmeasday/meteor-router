if (Meteor.is_client) {
  SimpleRouter = FilteredRouter.extend({
    initialize: function() {
      FilteredRouter.prototype.initialize.call(this);
      this.filter(this.require_login, {only: ['home']});
    },
    
    require_login: function(page) {
      var username = Session.get('username');
      if (username) {
        return page;
      } else {
        return 'sign_in';
      }
    },
    
    routes: {'': 'home'},
    home: function() { this.goto('home'); }
  })
  
  var Router = new SimpleRouter();
  Meteor.startup(function() {
    Backbone.history.start();
  });
  
  Template.sign_in.events = {
    'submit form': function(e) {
      e.preventDefault();
      Session.set('username', $(event.target).find('[name=username]').val())
    }
  }
  
  Template.home.username = function() { return Session.get('username'); }
  Template.home.events = {
    'click .logout': function() { Session.set('username', false); }
  }

}
