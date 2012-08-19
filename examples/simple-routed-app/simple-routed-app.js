if (Meteor.is_client) {
  SimpleRouter = FilteredRouter.extend({
    initialize: function() {
      FilteredRouter.prototype.initialize.call(this);
      this.filter(this.require_login, {only: ['welcome']});
    },
    
    require_login: function(page) {
      var username = Session.get('username');
      if (username) {
        return page;
      } else {
        return 'sign_in';
      }
    },
    
    routes: {
      'welcome': 'welcome', 
      '': 'home'
    },
    home: function() { this.goto('home'); },
    welcome: function() { this.goto('welcome'); }
  })
  
  var Router = new SimpleRouter();
  Meteor.startup(function() {
    Backbone.history.start({pushState: true});
  });
  
  Template.sign_in.events = {
    'submit form': function(e) {
      e.preventDefault();
      Session.set('username', $(event.target).find('[name=username]').val())
    }
  }
  
  Template.home.events = {
    'click .welcome': function(e) {
      e.preventDefault();
      Router.navigate('welcome', {trigger: true});
    }
  }
  
  Template.welcome.username = function() { return Session.get('username'); }
  Template.welcome.events = {
    'click .logout': function(e) {
      e.preventDefault();
      Session.set('username', false);
    },
    'click .home': function(e) { 
      e.preventDefault();
      Router.navigate('', {trigger: true});
    }
  }

}
