if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('renderPage', function(name, options) {
    if (_.isUndefined(name))
      name = Meteor.Router.page();
    
    if (Template[name])
      return new Handlebars.SafeString(Template[name]());
  });
  
  Handlebars.registerHelper('currentPage', function() {
    return Meteor.Router.page();
  });
}
