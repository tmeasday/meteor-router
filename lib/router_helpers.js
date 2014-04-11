if (typeof Handlebars !== 'undefined') {
  var renderPage = function(name, options) {
    if (! _.isString(name))
      name = Meteor.Router.page();
    
    if (Template[name]) {
      if (!isBlaze())
        return new Handlebars.SafeString(Template[name](this));
      else
        return Template[name].extend({ data: this });
    }

    return null;
  };

  var currentPage = function () {
    return Meteor.Router.page();
  };

  if (!isBlaze()) {
    Handlebars.registerHelper('renderPage', renderPage);
    Handlebars.registerHelper('currentPage', currentPage);
  } else {
    UI.body.renderPage = renderPage;
    UI.body.currentPage = currentPage;
  }
}
