if (typeof Handlebars !== 'undefined') {
  if(typeof(UI) !== 'undefined') {
  	//Blaze Code

  	UI.body.helpers({
		renderPage: function(name, options) {
			var name = Meteor.Router.page();
			return Template[name];
		}
	});
  }else{
	  Handlebars.registerHelper('renderPage', function(name, options) {
	    if (! _.isString(name))
	      name = Meteor.Router.page();
	    
	    if (Template[name])
	      return new Handlebars.SafeString(Template[name](this));
	  });
  }
  
  Handlebars.registerHelper('currentPage', function() {
    return Meteor.Router.page();
  });
}
