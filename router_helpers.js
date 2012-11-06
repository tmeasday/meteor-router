if (Handlebars) {
  Handlebars.registerHelper('renderPage', function() {
    var name = Meteor.Router.page();
    
    if (Template[name])
      return new Handlebars.SafeString(Template[name]());
  });
}
  