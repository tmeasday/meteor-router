Package.describe({
  summary: "A reactive router built on page.js"
});

Package.on_use(function (api, where) {
  api.use('deps', 'client');
  api.use('startup', 'client');
  api.use('HTML5-History-API', 'client');
  api.use('page-js', 'client');
  api.use('underscore', ['client', 'server']);
  
  api.add_files('router_client.js', 'client');
  api.add_files('router_helpers.js', 'client');
  api.add_files('router_server.js', 'server');
});


Package.on_test(function (api) {
  api.use('router', ['client', 'server']);
  api.use('test-helpers', ['client', 'server']);
  api.use('tinytest', ['client', 'server']);
  
  api.use('session', 'client');
  api.add_files('router_client_tests.js', 'client');
  
  api.use('http', 'server');
  api.add_files('router_server_tests.js', 'server');
});
