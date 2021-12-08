(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expression = void 0;
const type_1 = require("../system/type");
const node_1 = require("./node");
class expression extends node_1.node {
    get_dominant_type(first_type, second_type) {
        return type_1.type_tbl[first_type][second_type];
    }
}
exports.expression = expression;

},{"../system/type":22,"./node":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.literal = void 0;
const node_1 = require("./node");
class literal extends node_1.node {
    get_string_value(str) {
        let result = str;
        if (str.endsWith('"'))
            result = str.replace(/\"/g, "");
        if (str.endsWith("'"))
            result = str.replace(/\'/g, "");
        result = result.replace(/\\t/g, '  ');
        result = result.replace(/\\n/g, '\n');
        result = result.replace(/\\r/g, '\n');
        return result;
    }
}
exports.literal = literal;

},{"./node":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.node = void 0;
class node {
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }
}
exports.node = node;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arithmetic_binary = exports.arithmetic_binary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
var arithmetic_binary_type;
(function (arithmetic_binary_type) {
    arithmetic_binary_type[arithmetic_binary_type["PLUS"] = 0] = "PLUS";
    arithmetic_binary_type[arithmetic_binary_type["MINUS"] = 1] = "MINUS";
    arithmetic_binary_type[arithmetic_binary_type["TIMES"] = 2] = "TIMES";
    arithmetic_binary_type[arithmetic_binary_type["DIV"] = 3] = "DIV";
    arithmetic_binary_type[arithmetic_binary_type["POWER"] = 4] = "POWER";
    arithmetic_binary_type[arithmetic_binary_type["MOD"] = 5] = "MOD";
})(arithmetic_binary_type = exports.arithmetic_binary_type || (exports.arithmetic_binary_type = {}));
class arithmetic_binary extends expression_1.expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        const dominant_type = this.get_dominant_type(left_data.type, right_data.type);
        switch (this.type) {
            case arithmetic_binary_type.PLUS:
                switch (dominant_type) {
                    case type_1.type.STRING:
                        return { value: (left_data.value.toString() + right_data.value.toString()), type: type_1.type.STRING };
                    case type_1.type.INTEGER:
                        left_data.value = (left_data.type == type_1.type.CHAR) ? left_data.value.charCodeAt(0) : left_data.value;
                        right_data.value = (right_data.type == type_1.type.CHAR) ? right_data.value.charCodeAt(0) : right_data.value;
                        return { value: (left_data.value + right_data.value), type: type_1.type.INTEGER };
                    case type_1.type.FLOAT:
                        left_data.value = (left_data.type == type_1.type.CHAR) ? left_data.value.charCodeAt(0) : left_data.value;
                        right_data.value = (right_data.type == type_1.type.CHAR) ? right_data.value.charCodeAt(0) : right_data.value;
                        return { value: (left_data.value + right_data.value), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' + ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MINUS:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (left_data.value - right_data.value), type: type_1.type.INTEGER };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' - ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.TIMES:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (left_data.value * right_data.value), type: type_1.type.INTEGER };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' * ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.POWER:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (Math.pow(left_data.value, right_data.value)), type: type_1.type.INTEGER };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' ** ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MOD:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (left_data.value % right_data.value), type: type_1.type.INTEGER };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' % ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.DIV:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        if (right_data.value == 0) {
                            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else
                            return { value: (left_data.value / right_data.value), type: type_1.type.INTEGER };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' / ' + right_data.type));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.arithmetic_binary = arithmetic_binary;

},{"../abstract/expression":4,"../system/error":21,"../system/type":22}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arithmetic_unary = exports.arithmetic_unary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
var arithmetic_unary_type;
(function (arithmetic_unary_type) {
    arithmetic_unary_type[arithmetic_unary_type["SQRT"] = 0] = "SQRT";
    arithmetic_unary_type[arithmetic_unary_type["SIN"] = 1] = "SIN";
    arithmetic_unary_type[arithmetic_unary_type["COS"] = 2] = "COS";
    arithmetic_unary_type[arithmetic_unary_type["TAN"] = 3] = "TAN";
    arithmetic_unary_type[arithmetic_unary_type["LOG10"] = 4] = "LOG10";
})(arithmetic_unary_type = exports.arithmetic_unary_type || (exports.arithmetic_unary_type = {}));
class arithmetic_unary extends expression_1.expression {
    constructor(expr, type, line, column) {
        super(line, column);
        this.expr = expr;
        this.type = type;
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        switch (this.type) {
            case arithmetic_unary_type.SQRT:
                switch (expr_data.type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        return { value: (Math.sqrt(expr_data.value)), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar sqrt para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.COS:
                switch (expr_data.type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        return { value: (Math.cos(expr_data.value)), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar cos para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.SIN:
                switch (expr_data.type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        return { value: (Math.sin(expr_data.value)), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar sin para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.TAN:
                switch (expr_data.type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        return { value: (Math.tan(expr_data.value)), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar tan para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.LOG10:
                switch (expr_data.type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        return { value: (Math.log10(expr_data.value)), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar log10 para: ' + expr_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.arithmetic_unary = arithmetic_unary;

},{"../abstract/expression":4,"../system/error":21,"../system/type":22}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logic = exports.logic_type = void 0;
const expression_1 = require("../abstract/expression");
const type_1 = require("../system/type");
var logic_type;
(function (logic_type) {
    logic_type[logic_type["AND"] = 0] = "AND";
    logic_type[logic_type["OR"] = 1] = "OR";
    logic_type[logic_type["NOT"] = 2] = "NOT";
})(logic_type = exports.logic_type || (exports.logic_type = {}));
class logic extends expression_1.expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        switch (this.type) {
            case logic_type.AND:
                return { value: (left_data.value && right_data.value), type: type_1.type.BOOLEAN };
            case logic_type.OR:
                return { value: (left_data.value || right_data.value), type: type_1.type.BOOLEAN };
            default:
                return { value: 0, type: type_1.type.INTEGER };
        }
    }
}
exports.logic = logic;

},{"../abstract/expression":4,"../system/type":22}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relational = exports.relational_type = void 0;
const expression_1 = require("../abstract/expression");
const type_1 = require("../system/type");
var relational_type;
(function (relational_type) {
    relational_type[relational_type["EQUAL"] = 0] = "EQUAL";
    relational_type[relational_type["NOTEQUAL"] = 1] = "NOTEQUAL";
    relational_type[relational_type["LESS"] = 2] = "LESS";
    relational_type[relational_type["LESSOREQUAL"] = 3] = "LESSOREQUAL";
    relational_type[relational_type["GREATER"] = 4] = "GREATER";
    relational_type[relational_type["GREATEROREQUAL"] = 5] = "GREATEROREQUAL";
})(relational_type = exports.relational_type || (exports.relational_type = {}));
class relational extends expression_1.expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        switch (this.type) {
            case relational_type.EQUAL:
                return { value: (left_data.value == right_data.value), type: type_1.type.BOOLEAN };
            case relational_type.NOTEQUAL:
                return { value: (left_data.value != right_data.value), type: type_1.type.BOOLEAN };
            case relational_type.GREATER:
                return { value: (left_data.value > right_data.value), type: type_1.type.BOOLEAN };
            case relational_type.GREATEROREQUAL:
                return { value: (left_data.value >= right_data.value), type: type_1.type.BOOLEAN };
            case relational_type.LESS:
                return { value: (left_data.value < right_data.value), type: type_1.type.BOOLEAN };
            case relational_type.LESSOREQUAL:
                return { value: (left_data.value <= right_data.value), type: type_1.type.BOOLEAN };
            default:
                return { value: 0, type: type_1.type.INTEGER };
        }
    }
}
exports.relational = relational;

},{"../abstract/expression":4,"../system/type":22}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_binary = exports.string_binary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
var string_binary_type;
(function (string_binary_type) {
    string_binary_type[string_binary_type["CONCAT"] = 0] = "CONCAT";
    string_binary_type[string_binary_type["REPEAT"] = 1] = "REPEAT";
    string_binary_type[string_binary_type["POSITION"] = 2] = "POSITION";
})(string_binary_type = exports.string_binary_type || (exports.string_binary_type = {}));
class string_binary extends expression_1.expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        switch (this.type) {
            case string_binary_type.CONCAT:
                if (left_data.type == type_1.type.STRING && right_data.type == type_1.type.STRING) {
                    return { value: (left_data.value.toString() + right_data.value.toString()), type: type_1.type.STRING };
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' & ' + right_data.value));
                }
                break;
            case string_binary_type.REPEAT:
                if (left_data.type == type_1.type.STRING && right_data.type == type_1.type.INTEGER) {
                    let return_value = "";
                    for (let index = 0; index < right_data.value; index++) {
                        return_value += left_data.value;
                    }
                    return { value: return_value, type: type_1.type.STRING };
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' ^ ' + right_data.value));
                }
                break;
            case string_binary_type.POSITION:
                if (left_data.type == type_1.type.STRING && right_data.type == type_1.type.INTEGER) {
                    let string_value = left_data.value.toString();
                    try {
                        return { value: string_value.charAt(right_data.value), type: type_1.type.STRING };
                    }
                    catch (err) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                    }
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.string_binary = string_binary;

},{"../abstract/expression":4,"../system/error":21,"../system/type":22}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_ternary = exports.string_ternary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
var string_ternary_type;
(function (string_ternary_type) {
    string_ternary_type[string_ternary_type["SUBSTRING"] = 0] = "SUBSTRING";
})(string_ternary_type = exports.string_ternary_type || (exports.string_ternary_type = {}));
class string_ternary extends expression_1.expression {
    constructor(first, second, third, type, line, column) {
        super(line, column);
        this.first = first;
        this.second = second;
        this.third = third;
        this.type = type;
    }
    execute(environment) {
        const first_data = this.first.execute(environment);
        const second_data = this.second.execute(environment);
        const third_data = this.third.execute(environment);
        switch (this.type) {
            case string_ternary_type.SUBSTRING:
                if (first_data.type == type_1.type.STRING && second_data.type == type_1.type.INTEGER && third_data.type == type_1.type.INTEGER) {
                    let string_return = first_data.value.toString();
                    return { value: string_return.substr(second_data.value, third_data.value), type: type_1.type.STRING };
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar substring ' + first_data.value + ' & ' + second_data.value + ' & ' + third_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.string_ternary = string_ternary;

},{"../abstract/expression":4,"../system/error":21,"../system/type":22}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_unary = exports.string_unary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
var string_unary_type;
(function (string_unary_type) {
    string_unary_type[string_unary_type["LENGTH"] = 0] = "LENGTH";
    string_unary_type[string_unary_type["UPPERCASE"] = 1] = "UPPERCASE";
    string_unary_type[string_unary_type["LOWERCASE"] = 2] = "LOWERCASE";
})(string_unary_type = exports.string_unary_type || (exports.string_unary_type = {}));
class string_unary extends expression_1.expression {
    constructor(expr, type, line, column) {
        super(line, column);
        this.expr = expr;
        this.type = type;
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        switch (this.type) {
            case string_unary_type.LENGTH:
                switch (expr_data.type) {
                    case type_1.type.STRING:
                        let string_value = expr_data.value.toString();
                        return { value: string_value.length, type: type_1.type.STRING };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar length para: ' + expr_data.value));
                }
                break;
            case string_unary_type.UPPERCASE:
                switch (expr_data.type) {
                    case type_1.type.STRING:
                        let string_value = expr_data.value.toString();
                        return { value: string_value.toUpperCase(), type: type_1.type.STRING };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar uppercase para: ' + expr_data.value));
                }
                break;
            case string_unary_type.LOWERCASE:
                switch (expr_data.type) {
                    case type_1.type.STRING:
                        let string_value = expr_data.value.toString();
                        return { value: string_value.toLowerCase(), type: type_1.type.STRING };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar lowercase para: ' + expr_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.string_unary = string_unary;

},{"../abstract/expression":4,"../system/error":21,"../system/type":22}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ternary = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class ternary extends expression_1.expression {
    constructor(first, second, third, line, column) {
        super(line, column);
        this.first = first;
        this.second = second;
        this.third = third;
    }
    execute(environment) {
        const first_data = this.first.execute(environment);
        const second_data = this.second.execute(environment);
        const third_data = this.third.execute(environment);
        if (first_data.type == type_1.type.BOOLEAN) {
            return { value: (first_data.value) ? second_data.value : third_data.value, type: (first_data.value) ? second_data.type : third_data.type };
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar opreacion ternaria: ' + first_data.value + ' & ' + second_data.value + ' & ' + third_data.value));
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.ternary = ternary;

},{"../abstract/expression":4,"../system/error":21,"../system/type":22}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unary = exports.unary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
var unary_type;
(function (unary_type) {
    unary_type[unary_type["ARITHMETIC"] = 0] = "ARITHMETIC";
    unary_type[unary_type["LOGIC"] = 1] = "LOGIC";
})(unary_type = exports.unary_type || (exports.unary_type = {}));
class unary extends expression_1.expression {
    constructor(expr, type, line, column) {
        super(line, column);
        this.expr = expr;
        this.type = type;
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        switch (this.type) {
            case unary_type.ARITHMETIC:
                switch (expr_data.type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        return { value: (Number(expr_data.value) * -1), type: expr_data.type };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar - para: ' + expr_data.value));
                }
                break;
            case unary_type.LOGIC:
                switch (expr_data.type) {
                    case type_1.type.BOOLEAN:
                        return { value: !expr_data.value, type: type_1.type.BOOLEAN };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar ! para: ' + expr_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.unary = unary;

},{"../abstract/expression":4,"../system/error":21,"../system/type":22}],16:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var main_grammar = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,6],$V2=[1,15],$V3=[1,7],$V4=[1,8],$V5=[1,9],$V6=[1,10],$V7=[1,11],$V8=[1,13],$V9=[1,16],$Va=[1,17],$Vb=[1,18],$Vc=[1,19],$Vd=[1,20],$Ve=[1,21],$Vf=[2,5,13,14,17,18,19,20,21,41,43,44,45,46,47,48],$Vg=[1,24],$Vh=[1,25],$Vi=[1,26],$Vj=[1,27],$Vk=[1,28],$Vl=[1,29],$Vm=[1,30],$Vn=[1,31],$Vo=[1,32],$Vp=[1,33],$Vq=[1,34],$Vr=[1,35],$Vs=[1,36],$Vt=[1,37],$Vu=[1,38],$Vv=[1,39],$Vw=[1,40],$Vx=[2,5,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,34,35,38,39,41,43,44,45,46,47,48],$Vy=[2,5,8,9,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,34,35,38,39,41,43,44,45,46,47,48],$Vz=[2,5,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,34,35,38,39,41,43,44,45,46,47,48],$VA=[2,5,13,14,15,16,17,18,19,20,21,24,25,28,29,30,34,35,38,39,41,43,44,45,46,47,48],$VB=[2,5,13,14,15,16,17,18,19,20,21,30,34,35,39,41,43,44,45,46,47,48];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"pr_init":3,"pr_instructions":4,"EOF":5,"pr_instruction":6,"pr_expr":7,"tk_plus":8,"tk_minus":9,"tk_times":10,"tk_division":11,"tk_mod":12,"tk_power":13,"tk_par_o":14,"tk_comma":15,"tk_par_c":16,"tk_sqrt":17,"tk_sin":18,"tk_cos":19,"tk_tan":20,"tk_log10":21,"tk_less_equal":22,"tk_greater_equal":23,"tk_double_equal":24,"tk_not_equal":25,"tk_greater":26,"tk_less":27,"tk_and":28,"tk_or":29,"tk_dot":30,"tk_length":31,"tk_uppercase":32,"tk_lowercase":33,"tk_concat":34,"tk_repeat":35,"tk_position":36,"tk_substring":37,"tk_ternary":38,"tk_colon":39,"pr_unary":40,"tk_not":41,"pr_native":42,"tk_float":43,"tk_string":44,"tk_null":45,"tk_char":46,"tk_int":47,"tk_bool":48,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"tk_plus",9:"tk_minus",10:"tk_times",11:"tk_division",12:"tk_mod",13:"tk_power",14:"tk_par_o",15:"tk_comma",16:"tk_par_c",17:"tk_sqrt",18:"tk_sin",19:"tk_cos",20:"tk_tan",21:"tk_log10",22:"tk_less_equal",23:"tk_greater_equal",24:"tk_double_equal",25:"tk_not_equal",26:"tk_greater",27:"tk_less",28:"tk_and",29:"tk_or",30:"tk_dot",31:"tk_length",32:"tk_uppercase",33:"tk_lowercase",34:"tk_concat",35:"tk_repeat",36:"tk_position",37:"tk_substring",38:"tk_ternary",39:"tk_colon",41:"tk_not",43:"tk_float",44:"tk_string",45:"tk_null",46:"tk_char",47:"tk_int",48:"tk_bool"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[7,3],[7,3],[7,3],[7,3],[7,3],[7,6],[7,4],[7,4],[7,4],[7,4],[7,4],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,5],[7,5],[7,5],[7,3],[7,3],[7,6],[7,8],[7,5],[7,1],[40,2],[40,1],[40,3],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

        return $$[$0-1];
    
break;
case 2:

        $$[$0-1].push($$[$0])
        this.$ = $$[$0-1]
    
break;
case 3:

        this.$ = [$$[$0]]
    
break;
case 4: case 33: case 35:

        this.$ = $$[$0]
    
break;
case 5:

        error_arr.push(new error(_$[$0].first_line, _$[$0].first_column, error_type.SINTACTICO, yytext));  
    
break;
case 6:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.PLUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 7:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MINUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 8:
 
        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.TIMES, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 9:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.DIV, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 10:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MOD, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 11:

        this.$ = new arithmetic_binary($$[$0-3], $$[$0-1], arithmetic_binary_type.POWER, _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 12:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SQRT, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 13:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SIN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 14:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.COS, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 15:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.TAN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 16:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.LOG10, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 17:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESSOREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 18:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATEROREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 19:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.EQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 20:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.NOTEQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 21:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATER ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 22:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESS, _$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 23:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.AND ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 24:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.OR ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 25:

        this.$ = new string_unary($$[$0-4],string_unary_type.LENGTH ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 26:

        this.$ = new string_unary($$[$0-4],string_unary_type.UPPERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 27:

        this.$ = new string_unary($$[$0-4],string_unary_type.LOWERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 28:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.CONCAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 29:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.REPEAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 30:

        this.$ = new string_binary($$[$0-5], $$[$0-1],string_binary_type.POSITION ,_$[$0-5].first_line, _$[$0-5].first_column);
    
break;
case 31:

        this.$ = new string_ternary($$[$0-7], $$[$0-3], $$[$0-1], string_ternary_type.SUBSTRING ,_$[$0-7].first_line, _$[$0-7].first_column);
    
break;
case 32:

        this.$ = new ternary($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 34:

        this.$ = new unary($$[$0], unary_type.LOGIC ,_$[$0-1].first_line, _$[$0-1].first_column);
    
break;
case 36:

        this.$ = $$[$0-1]
    
break;
case 37:

        this.$ = new native($$[$0], type.FLOAT ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 38:

        this.$ = new native($$[$0], type.STRING ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 39:

        this.$ = new native($$[$0], type.NULL ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 40:

        this.$ = new native($$[$0], type.CHAR ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 41:

        this.$ = new native($$[$0], type.INTEGER ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 42:

        this.$ = new native($$[$0], type.BOOLEAN ,_$[$0].first_line, _$[$0].first_column);
    
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{1:[3]},{2:$V0,5:[1,22],6:23,7:4,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},o($Vf,[2,3]),o($Vf,[2,4],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw}),o($Vf,[2,5]),{14:[1,41]},{14:[1,42]},{14:[1,43]},{14:[1,44]},{14:[1,45]},{14:[1,46]},o($Vx,[2,33]),{14:$V2,40:47,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},o($Vx,[2,35]),{7:48,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},o($Vx,[2,37]),o($Vx,[2,38]),o($Vx,[2,39]),o($Vx,[2,40]),o($Vx,[2,41]),o($Vx,[2,42]),{1:[2,1]},o($Vf,[2,2]),{7:49,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:50,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:51,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:52,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:53,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:54,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:55,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:56,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:57,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:58,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:59,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:60,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:61,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{31:[1,62],32:[1,63],33:[1,64],36:[1,65],37:[1,66]},{7:67,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:68,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:69,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:70,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:71,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:72,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:73,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:74,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:75,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},o($Vx,[2,34]),{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,76],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},o($Vy,[2,6],{10:$Vi,11:$Vj,12:$Vk}),o($Vy,[2,7],{10:$Vi,11:$Vj,12:$Vk}),o($Vx,[2,8]),o($Vx,[2,9]),o($Vx,[2,10]),o($Vz,[2,17],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk}),o($Vz,[2,18],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk}),o($VA,[2,19],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,26:$Vp,27:$Vq}),o($VA,[2,20],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,26:$Vp,27:$Vq}),o($Vz,[2,21],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk}),o($Vz,[2,22],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk}),o([2,5,13,14,15,16,17,18,19,20,21,28,29,30,34,35,38,39,41,43,44,45,46,47,48],[2,23],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq}),o([2,5,13,14,15,16,17,18,19,20,21,29,30,34,35,38,39,41,43,44,45,46,47,48],[2,24],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr}),{14:[1,77]},{14:[1,78]},{14:[1,79]},{14:[1,80]},{14:[1,81]},o($VB,[2,28],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,38:$Vw}),o($VB,[2,29],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,38:$Vw}),{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw,39:[1,82]},{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,15:[1,83],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,84],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,85],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,86],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,87],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,88],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},o($Vx,[2,36]),{16:[1,89]},{16:[1,90]},{16:[1,91]},{7:92,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:93,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:94,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},{7:95,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},o($Vx,[2,12]),o($Vx,[2,13]),o($Vx,[2,14]),o($Vx,[2,15]),o($Vx,[2,16]),o($Vx,[2,25]),o($Vx,[2,26]),o($Vx,[2,27]),{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,96],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,15:[1,97],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},o([2,5,13,14,15,16,17,18,19,20,21,30,34,35,38,39,41,43,44,45,46,47,48],[2,32],{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs}),{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,98],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},o($Vx,[2,30]),{7:99,13:$V1,14:$V2,17:$V3,18:$V4,19:$V5,20:$V6,21:$V7,40:12,41:$V8,42:14,43:$V9,44:$Va,45:$Vb,46:$Vc,47:$Vd,48:$Ve},o($Vx,[2,11]),{8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,16:[1,100],22:$Vl,23:$Vm,24:$Vn,25:$Vo,26:$Vp,27:$Vq,28:$Vr,29:$Vs,30:$Vt,34:$Vu,35:$Vv,38:$Vw},o($Vx,[2,31])],
defaultActions: {22:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

    const {type} = require("../system/type") ;
    const { error, error_arr, error_type }= require("../system/error");

    const {arithmetic_binary, arithmetic_binary_type} = require('../expression/arithmetic_binary');
    const {arithmetic_unary, arithmetic_unary_type} = require('../expression/arithmetic_unary');
    const {relational, relational_type} = require('../expression/relational');
    const {logic, logic_type} = require('../expression/logic');
    const {unary, unary_type} = require('../expression/unary');
    const {ternary} = require('../expression/ternary');
    const {string_unary, string_unary_type} = require('../expression/string_unary');
    const {string_binary, string_binary_type} = require('../expression/string_binary');
    const {string_ternary, string_ternary_type} = require('../expression/string_ternary');

    const {native} = require('../literal/native');
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-sensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* Skip Whitespace */
break;
case 1:/* Skip tabs */
break;
case 2:/* Skip return */
break;
case 3:/* Comments */
break;
case 4:/* Multiline Comments */
break;
case 5:return 36
break;
case 6:return 37
break;
case 7:return 31
break;
case 8:return 32
break;
case 9:return 33
break;
case 10:return 45
break;
case 11:return 48
break;
case 12:return 48
break;
case 13:return 13
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 19
break;
case 17:return 20
break;
case 18:return 21
break;
case 19:return 47
break;
case 20:return 'tk_double'
break;
case 21:return 46
break;
case 22:return 'tk_string_type'
break;
case 23:return 'tk_if'
break;
case 24:return 'tk_else'
break;
case 25:return 'tk_switch'
break;
case 26:return 'tk_case'
break;
case 27:return 'tk_default'
break;
case 28:return 'tk_break'
break;
case 29:return 'tk_continue'
break;
case 30:return 'tk_while'
break;
case 31:return 'tk_do'
break;
case 32:return 'tk_for'
break;
case 33:return 'tk_void'
break;
case 34:return 'tk_main'
break;
case 35:return 'tk_println'
break;
case 36:return 'tk_print'
break;
case 37:return 'tk_return'
break;
case 38:return 'tk_struct'
break;
case 39:return 'tk_parse'
break;
case 40:return 'tk_toInt'
break;
case 41:return 'tk_toDouble'
break;
case 42:return 44
break;
case 43:return 'tk_typeof'
break;
case 44:return 'tk_function'
break;
case 45:return 'tk_elseif'
break;
case 46:return 'tk_break'
break;
case 47:return 'tk_continue'
break;
case 48:return 'tk_in'
break;
case 49:return 'tk_begin'
break;
case 50:return 'tk_end'
break;
case 51:return 'tk_push'
break;
case 52:return 'tk_pop'
break;
case 53:return 45
break;
case 54:return 43
break;
case 55:return 47
break;
case 56:return 44
break;
case 57:return 46
break;
case 58:return 'tk_id'
break;
case 59:return 10
break;
case 60:return 11
break;
case 61:return 'tk_double_plus'
break;
case 62:return 'tk_double_minus'
break;
case 63:return 8
break;
case 64:return 9
break;
case 65:return 12
break;
case 66:return 22
break;
case 67:return 23
break;
case 68:return 27
break;
case 69:return 26
break;
case 70:return 24
break;
case 71:return 25
break;
case 72:return 29
break;
case 73:return 34
break;
case 74:return 28
break;
case 75:return 41
break;
case 76:return 'tk_equal'
break;
case 77:return 14
break;
case 78:return 16 
break;
case 79:return 'tk_cbra_o'
break;
case 80:return 'tk_cbra_c'
break;
case 81:return 'tk_bra_o'
break;
case 82:return 'tk_bra_c'
break;
case 83:return 15
break;
case 84:return 35
break;
case 85:return 30
break;
case 86:return 38
break;
case 87:return 39
break;
case 88:return 'tk_semicolon'
break;
case 89:return 'tk_hash'
break;
case 90:return 5
break;
case 91:error_arr.push(new error(yy_.yylloc.first_line, yy_.yylloc.first_column, error_type.LEXICO,'Valor inesperado ' + yy_.yytext));  
break;
}
},
rules: [/^(?:\s+)/,/^(?:\t)/,/^(?:\r)/,/^(?:\/\/.*)/,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:log10\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:String\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:return\b)/,/^(?:struct\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:function\b)/,/^(?:elseif\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:in\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:null\b)/,/^(?:([0-9]+(\.[0-9]+)))/,/^(?:([0-9]+))/,/^(?:(([\"][^"]*[\"])))/,/^(?:(([\'][^\']{1}[\'])))/,/^(?:(([a-zA-Z_])[a-zA-Z0-9_ñÑ]*))/,/^(?:\*)/,/^(?:\/)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:%)/,/^(?:<=)/,/^(?:>=)/,/^(?:<)/,/^(?:>)/,/^(?:==)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&)/,/^(?:&&)/,/^(?:!)/,/^(?:=)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?:\^)/,/^(?:\.)/,/^(?:\?)/,/^(?::)/,/^(?:;)/,/^(?:#)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = main_grammar;
exports.Parser = main_grammar.Parser;
exports.parse = function () { return main_grammar.parse.apply(main_grammar, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../expression/arithmetic_binary":7,"../expression/arithmetic_unary":8,"../expression/logic":9,"../expression/relational":10,"../expression/string_binary":11,"../expression/string_ternary":12,"../expression/string_unary":13,"../expression/ternary":14,"../expression/unary":15,"../literal/native":17,"../system/error":21,"../system/type":22,"_process":3,"fs":1,"path":2}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native = void 0;
const literal_1 = require("../abstract/literal");
const type_1 = require("../system/type");
class native extends literal_1.literal {
    constructor(value, type, line, column) {
        super(line, column);
        this.value = value;
        this.type = type;
    }
    execute(environment) {
        switch (this.type) {
            case type_1.type.INTEGER:
                return { value: Number(this.value), type: type_1.type.INTEGER };
            case type_1.type.FLOAT:
                return { value: Number(this.value), type: type_1.type.FLOAT };
            case type_1.type.STRING:
                return { value: this.get_string_value(this.value), type: type_1.type.STRING };
            case type_1.type.CHAR:
                return { value: this.get_string_value(this.value), type: type_1.type.CHAR };
            case type_1.type.NULL:
                return { value: null, type: type_1.type.NULL };
            case type_1.type.BOOLEAN:
                return { value: (this.value === 'false') ? false : true, type: type_1.type.BOOLEAN };
            default:
                return { value: this.value, type: type_1.type.STRING };
        }
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.native = native;

},{"../abstract/literal":5,"../system/type":22}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./grammar/main_grammar");
const environment_1 = require("./system/environment");
const console_1 = require("./system/console");
const error_1 = require("./system/error");
window.exec = function (input) {
    try {
        const ast = parser.parse(input);
        const main_environment = new environment_1.environment(null);
        console.log("ast", ast);
        console_1._console.output = "";
        for (const instr of ast) {
            try {
                console_1._console.output += instr.execute(main_environment).value + "\n";
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    if (error_1.error_arr.length > 0) {
        console.log(error_1.error_arr);
        return "$error$";
    }
    return console_1._console.output;
};

},{"./grammar/main_grammar":16,"./system/console":19,"./system/environment":20,"./system/error":21}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._console = void 0;
class console {
    constructor() {
        this.output = "";
        this.symbols = new Map();
        this.stack = new Array;
        this.heap = new Array;
        this.printOption = 0;
    }
    saveInHeap(index, id) {
        this.heap[index] = id;
    }
    saveInStack(index, id) {
        this.stack[index] = id;
    }
}
exports._console = new console();

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
class environment {
    constructor(previous) {
        this.previous = previous;
        this.previous = previous;
        this.variable_map = new Map();
        this.function_map = new Map();
    }
}
exports.environment = environment;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_arr = exports.error_type = exports.error = void 0;
class error {
    constructor(line, column, type, message) {
        this.line = line;
        this.column = column;
        this.type = type;
        this.message = message;
    }
    html() {
        let result = "<td>" + this.type + "</td>";
        result += "<td>" + this.message + "</td>";
        result += "<td>" + this.line + "</td>";
        result += "<td>" + this.column + "</td>";
        return result;
    }
}
exports.error = error;
var error_type;
(function (error_type) {
    error_type[error_type["LEXICO"] = 0] = "LEXICO";
    error_type[error_type["SINTACTICO"] = 1] = "SINTACTICO";
    error_type[error_type["SEMANTICO"] = 2] = "SEMANTICO";
})(error_type = exports.error_type || (exports.error_type = {}));
exports.error_arr = [];

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type_tbl = exports.type = void 0;
var type;
(function (type) {
    type[type["INTEGER"] = 0] = "INTEGER";
    type[type["STRING"] = 1] = "STRING";
    type[type["BOOLEAN"] = 2] = "BOOLEAN";
    type[type["FLOAT"] = 3] = "FLOAT";
    type[type["CHAR"] = 4] = "CHAR";
    type[type["NULL"] = 5] = "NULL";
})(type = exports.type || (exports.type = {}));
/*
        INTEGER        STRING       BOOLEAN       FLOAT     CHAR
*/
exports.type_tbl = [
    [
        type.INTEGER, type.STRING, type.NULL, type.FLOAT, type.INTEGER
    ],
    [
        type.STRING, type.STRING, type.STRING, type.STRING, type.STRING
    ],
    [
        type.NULL, type.STRING, type.NULL, type.NULL, type.NULL
    ],
    [
        type.FLOAT, type.STRING, type.NULL, type.FLOAT, type.FLOAT
    ],
    [
        type.INTEGER, type.STRING, type.NULL, type.FLOAT, type.INTEGER
    ]
];

},{}]},{},[18]);
