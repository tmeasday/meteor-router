if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('renderPage', function(name, options) {
    if (! _.isString(name))
      name = Meteor.Router.page();
    
    if (Template[name])
      return new Handlebars.SafeString(Template[name]());
  });
}
  