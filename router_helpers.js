if (Handlebars) {
  // a simple handlebars function that lets you render a page based a reactive var
  Handlebars.registerHelper('render', function(name) {
    if (Template[name])
      return Template[name]();
  });
  
  // if Router is defined, provide a currentPage helper
  Handlebars.registerHelper('currentPage', function() {
    if (Router)
      return Router.current_page();
  });
}
  