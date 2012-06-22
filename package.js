Package.describe({
  summary: "Extension to backbone's router to achieve common reactivity and filters"
});

Package.on_use(function (api, where) {
  api.use('deps-extensions', 'client');
  api.use('backbone', 'client');
  api.add_files('router.js', 'client');
});


Package.on_test(function (api) {
  api.use('router', 'client');
  api.use('test-helpers', 'client');
  api.use('tinytest', 'client');

  api.add_files('router_tests.js', 'client');
});
