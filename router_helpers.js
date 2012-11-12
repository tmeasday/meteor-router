if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('renderPage', function() {
    var name = Meteor.Router.page();
    
    if (Template[name])
      return new Handlebars.SafeString(Template[name]());
  });
}
  