(function() {
  var Router = function() {
    this._routes = [];
    this._config = {};
    this._started = false;
  };

  // simply match this path to this function
  Router.prototype.add = function(path, method, endpoint)  {
    var self = this;

    // Start serving on first add() call
    if(!this._started){
      this._start();
    }

    if (_.isObject(path) && ! _.isRegExp(path)) {
      _.each(path, function(endpoint, p) {
        self.add(p, endpoint);
      });
    } else {
      if (! endpoint) {
        // no http method was supplied so 2nd parameter is the endpoint
        endpoint = method;
        method = null;
      }
      if (! _.isFunction(endpoint)) {
        endpoint = _.bind(_.identity, null, endpoint);
      }
      self._routes.push([new Meteor.Router.Route(path, method), endpoint]);
    }
  };

  Router.prototype.match = function(request, response) {
    for (var i = 0; i < this._routes.length; i++) {
      var params = [], route = this._routes[i];

      if (route[0].match(request.url, request.method, params)) {
        context = {request: request, response: response, params: params};

        var args = [];
        for (var key in context.params)
          args.push(context.params[key]);

        return route[1].apply(context, args);
      }
    }

    return false;
  };

  Router.prototype.configure = function(config){
    if(this._started){
      throw new Error("Router.configure() has to be called before first call to Router.add()");
    }

    this._config = config;
  };

  Router.prototype._start = function(){
    var self = this;

    if(this._started){
      throw new Error("Router has already been started");
    }

    this._started = true;

    // hook up the serving
    var connect = (typeof(Npm) == "undefined") ? __meteor_bootstrap__.require("connect") : Npm.require("connect");
    __meteor_bootstrap__.app
      .use(connect.query()) // <- XXX: we can probably assume accounts did this
      .use(connect.bodyParser(this._config.bodyParser))
      .use(function(req, res, next) {
        // need to wrap in a fiber in case they do something async
        // (e.g. in the database)
        if(typeof(Fiber)=="undefined") Fiber = Npm.require('fibers');

        Fiber(function() {
          var output = Meteor.Router.match(req, res);

          if (output === false) {
            return next();
          } else {
            // parse out the various type of response we can have

            // array can be
            // [content], [status, content], [status, headers, content]
            if (_.isArray(output)) {
              // copy the array so we aren't actually modifying it!
              output = output.slice(0);

              if (output.length === 3) {
                var headers = output.splice(1, 1)[0];
                _.each(headers, function(value, key) {
                  res.setHeader(key, value);
                });
              }

              if (output.length === 2) {
                res.statusCode = output.shift();
              }

              output = output[0];
            }

            if (_.isNumber(output)) {
              res.statusCode = output;
              output = '';
            }

            return res.end(output);
          }
        }).run();
      });
  };

  // Make the router available
  Meteor.Router = new Router();
}());

