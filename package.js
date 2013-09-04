Package.describe({
  summary: "A reactive router built on page.js"
});

Npm.depends({
  'connect': '2.7.10'
});

Package.on_use(function (api, where) {
  api.use('deps', 'client');
  api.use('startup', 'client');
  api.use('templating', 'client');
  api.use('handlebars', 'client');
  api.use('page-js-ie-support', 'client');
  api.use('underscore', ['client', 'server']);
  
  api.add_files('lib/router_client.js', 'client');
  api.add_files('lib/router_helpers.js', 'client');
  api.add_files('lib/router_server.js', 'server');
  api.add_files('lib/router_common.js', ['client', 'server']);
  
  // for backward compat before Meteor linker changes
  if (typeof api.export !== 'undefined') {
    api.use('webapp', 'server');
    
    api.use('HTML5-History-API', 'client', {weak: true});
  }
});


Package.on_test(function (api) {
  api.use('router', ['client', 'server']);
  api.use('test-helpers', ['client', 'server']);
  api.use('tinytest', ['client', 'server']);
  
  api.use('session', 'client');
  api.add_files('tests/router_client_tests.js', 'client');
  
  api.use('http', 'server');
  api.add_files('tests/router_server_tests.js', 'server');
  
  api.add_files('tests/router_common_tests.js', ['client', 'server']);
});
