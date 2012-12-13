(function() {
  // Route object taken from page.js
  //
  // Copyright (c) 2012 TJ Holowaychuk &lt;tj@vision-media.ca&gt;
  //
  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys
      , qsIndex = path.indexOf('?')
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      , m = this.regexp.exec(pathname);
  
    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/\+/g, '__plus__')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/__plus__/g, '(.+)')
      .replace(/\*/g, '(.*)');
    
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };
  
  /// END Route object
  
  var Router = function() {
    this._routes = [];
  };
  
  // simply match this path to this function
  Router.prototype.add = function(path, endpoint)  {
    var self = this;
    
    if (_.isObject(path) && ! _.isRegExp(path)) {
      _.each(path, function(endpoint, p) {
        self.add(p, endpoint);
      });
    } else {
      if (! _.isFunction(endpoint)) {
        endpoint = _.bind(_.identity, null, endpoint);
      }
      self._routes.push([new Route(path), endpoint]);
    }
  }
  
  Router.prototype.match = function(request, response) {
    for (var i = 0; i < this._routes.length; i++) {
      var params = [], route = this._routes[i];
      
      if (route[0].match(request.url, params)) {
        context = {request: request, response: response, params: params}
        
        var args = [];
        for (key in context.params)
          args.push(context.params[key]);
        
        return route[1].apply(context, args);
      }
    }
    
    return false;
  }
  
  // Make the router available
  Meteor.Router = new Router();
  
  // hook up the serving
  var connect = __meteor_bootstrap__.require("connect");
  __meteor_bootstrap__.app
    .use(connect.query()) // <- XXX: we can probably assume accounts did this
    .use(connect.bodyParser())
    .use(function(req, res, next) {
      // need to wrap in a fiber in case they do something async 
      // (e.g. in the database)
      Fiber(function() {
        var output = Meteor.Router.match(req, res);
        
        if (output === false) {
          return next();
        } else {
          // parse out the various type of response we can have
          
          // array can be
          // [content], [status, content], [status, headers, content]
          if (_.isArray(output)) {
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

}())

