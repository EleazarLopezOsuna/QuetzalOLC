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

},{"../system/type":23,"./node":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instruction = void 0;
const node_1 = require("./node");
class instruction extends node_1.node {
}
exports.instruction = instruction;

},{"./node":7}],6:[function(require,module,exports){
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

},{"./node":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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
                    case type_1.type.FLOAT:
                        return { value: (left_data.value - right_data.value), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' - ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.TIMES:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (left_data.value * right_data.value), type: type_1.type.INTEGER };
                    case type_1.type.FLOAT:
                        return { value: (left_data.value * right_data.value), type: type_1.type.FLOAT };
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
                    case type_1.type.FLOAT:
                        return { value: (left_data.value % right_data.value), type: type_1.type.FLOAT };
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
                    case type_1.type.FLOAT:
                        if (right_data.value == 0) {
                            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else
                            return { value: (left_data.value / right_data.value), type: type_1.type.FLOAT };
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

},{"../abstract/expression":4,"../system/error":22,"../system/type":23}],9:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/error":22,"../system/type":23}],10:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/type":23}],11:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/type":23}],12:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/error":22,"../system/type":23}],13:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/error":22,"../system/type":23}],14:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/error":22,"../system/type":23}],15:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/error":22,"../system/type":23}],16:[function(require,module,exports){
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
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../system/error":22,"../system/type":23}],17:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,18],$V1=[1,15],$V2=[1,26],$V3=[1,29],$V4=[1,30],$V5=[1,31],$V6=[1,32],$V7=[1,33],$V8=[1,13],$V9=[1,14],$Va=[1,16],$Vb=[1,27],$Vc=[1,28],$Vd=[1,24],$Ve=[1,23],$Vf=[1,21],$Vg=[1,22],$Vh=[1,20],$Vi=[1,19],$Vj=[2,5,14,20,28,29,30,31,32,33,42,43,46,48,50,53,54,57,58,59,62,64,65],$Vk=[1,60],$Vl=[1,57],$Vm=[1,64],$Vn=[1,50],$Vo=[1,51],$Vp=[1,52],$Vq=[1,53],$Vr=[1,54],$Vs=[1,55],$Vt=[1,58],$Vu=[1,61],$Vv=[1,62],$Vw=[1,63],$Vx=[1,65],$Vy=[1,66],$Vz=[20,25,63],$VA=[1,105],$VB=[1,92],$VC=[1,93],$VD=[1,94],$VE=[1,95],$VF=[1,96],$VG=[1,97],$VH=[1,98],$VI=[1,99],$VJ=[1,100],$VK=[1,101],$VL=[1,102],$VM=[1,103],$VN=[1,104],$VO=[1,106],$VP=[1,107],$VQ=[1,108],$VR=[12,13,17,22,26,52,63,69,70,71,72,73,80,81,82,83,84,85,86,87,91,92,95],$VS=[17,22],$VT=[1,137],$VU=[12,22],$VV=[23,25,52],$VW=[12,13,17,22,26,52,63,69,70,80,81,82,83,84,85,86,87,91,92,95],$VX=[12,13,17,22,26,52,63,80,81,82,83,84,85,86,87,91,92,95],$VY=[12,13,17,22,26,52,63,82,83,86,87,91,92,95],$VZ=[12,13,17,22,26,52,63,91,92],$V_=[1,218],$V$=[1,219],$V01=[14,22],$V11=[1,231],$V21=[1,232],$V31=[14,62,64];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"pr_init":3,"pr_instructions":4,"EOF":5,"pr_globals":6,"pr_global":7,"pr_main":8,"tk_void":9,"tk_main":10,"tk_par_o":11,"tk_par_c":12,"tk_cbra_o":13,"tk_cbra_c":14,"pr_newSubProgram":15,"pr_newVariable":16,"tk_semicolon":17,"pr_newStruct":18,"pr_type":19,"tk_id":20,"pr_declarations":21,"tk_comma":22,"tk_equal":23,"pr_expr":24,"tk_bra_o":25,"tk_bra_c":26,"pr_ids":27,"tk_struct":28,"tk_integer":29,"tk_double":30,"tk_string_type":31,"tk_boolean":32,"tk_char":33,"pr_instruction":34,"pr_if":35,"pr_switch":36,"pr_while":37,"pr_do":38,"pr_for":39,"pr_assignment":40,"pr_subProgramCall":41,"tk_break":42,"tk_continue":43,"tk_double_plus":44,"tk_double_minus":45,"tk_return":46,"pr_print":47,"tk_print":48,"pr_exprList":49,"tk_println":50,"pr_access":51,"tk_dot":52,"tkid":53,"tk_for":54,"pr_forStart":55,"tk_in":56,"tk_while":57,"tk_do":58,"tk_switch":59,"pr_cases":60,"pr_case":61,"tk_case":62,"tk_colon":63,"tk_default":64,"tk_if":65,"pr_else":66,"tk_elseif":67,"tk_else":68,"tk_plus":69,"tk_minus":70,"tk_times":71,"tk_division":72,"tk_mod":73,"tk_power":74,"tk_sqrt":75,"tk_sin":76,"tk_cos":77,"tk_tan":78,"tk_log10":79,"tk_less_equal":80,"tk_greater_equal":81,"tk_double_equal":82,"tk_not_equal":83,"tk_greater":84,"tk_less":85,"tk_and":86,"tk_or":87,"tk_length":88,"tk_uppercase":89,"tk_lowercase":90,"tk_concat":91,"tk_repeat":92,"tk_position":93,"tk_substring":94,"tk_ternary":95,"pr_unary":96,"tk_hash":97,"tk_not":98,"pr_native":99,"tk_float":100,"tk_string":101,"tk_null":102,"tk_int":103,"tk_bool":104,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",9:"tk_void",10:"tk_main",11:"tk_par_o",12:"tk_par_c",13:"tk_cbra_o",14:"tk_cbra_c",17:"tk_semicolon",20:"tk_id",22:"tk_comma",23:"tk_equal",25:"tk_bra_o",26:"tk_bra_c",28:"tk_struct",29:"tk_integer",30:"tk_double",31:"tk_string_type",32:"tk_boolean",33:"tk_char",42:"tk_break",43:"tk_continue",44:"tk_double_plus",45:"tk_double_minus",46:"tk_return",48:"tk_print",50:"tk_println",52:"tk_dot",53:"tkid",54:"tk_for",56:"tk_in",57:"tk_while",58:"tk_do",59:"tk_switch",62:"tk_case",63:"tk_colon",64:"tk_default",65:"tk_if",67:"tk_elseif",68:"tk_else",69:"tk_plus",70:"tk_minus",71:"tk_times",72:"tk_division",73:"tk_mod",74:"tk_power",75:"tk_sqrt",76:"tk_sin",77:"tk_cos",78:"tk_tan",79:"tk_log10",80:"tk_less_equal",81:"tk_greater_equal",82:"tk_double_equal",83:"tk_not_equal",84:"tk_greater",85:"tk_less",86:"tk_and",87:"tk_or",88:"tk_length",89:"tk_uppercase",90:"tk_lowercase",91:"tk_concat",92:"tk_repeat",93:"tk_position",94:"tk_substring",95:"tk_ternary",97:"tk_hash",98:"tk_not",100:"tk_float",101:"tk_string",102:"tk_null",103:"tk_int",104:"tk_bool"},
productions_: [0,[3,2],[6,2],[6,2],[6,1],[6,1],[8,7],[7,1],[7,2],[7,2],[15,8],[15,7],[15,8],[15,7],[21,4],[21,2],[16,4],[16,6],[16,2],[27,3],[27,1],[18,5],[19,1],[19,1],[19,1],[19,1],[19,1],[4,2],[4,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,2],[34,2],[34,2],[34,2],[34,2],[34,2],[34,3],[34,3],[34,3],[34,2],[34,1],[47,4],[47,4],[40,3],[40,4],[51,3],[51,4],[51,2],[51,3],[41,4],[41,3],[49,3],[49,1],[39,11],[39,7],[55,4],[55,3],[37,7],[38,9],[36,7],[60,2],[60,1],[61,4],[61,3],[35,7],[35,6],[66,7],[66,6],[66,4],[24,3],[24,3],[24,3],[24,3],[24,3],[24,6],[24,4],[24,4],[24,4],[24,4],[24,4],[24,3],[24,3],[24,3],[24,3],[24,3],[24,3],[24,3],[24,3],[24,5],[24,5],[24,5],[24,3],[24,3],[24,6],[24,8],[24,5],[24,1],[24,1],[24,2],[96,2],[96,1],[96,3],[99,1],[99,1],[99,1],[99,1],[99,1],[99,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

        return $$[$0-1];
    
break;
case 2: case 3: case 27:

        $$[$0-1].push($$[$0])
        this.$ = $$[$0-1]
    
break;
case 4: case 5: case 28: case 56:

        this.$ = [$$[$0]]
    
break;
case 6: case 105:

        this.$ = $$[$0-1]
    
break;
case 7: case 29: case 30: case 31: case 32: case 33:
this.$ = $$[$0]
break;
case 8: case 9: case 34: case 35: case 36: case 37: case 38: case 39: case 43:
this.$ = $$[$0-1]
break;
case 45:
 
        this.$ = new print($$[$0-1], print_type.PRINT, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 46:
 
        this.$ = new print($$[$0-1], print_type.PRINTLN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 55:

        $$[$0-2].push($$[$0])
        this.$ = $$[$0-2]
    
break;
case 73:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.PLUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 74:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MINUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 75:
 
        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.TIMES, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 76:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.DIV, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 77:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MOD, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 78:

        this.$ = new arithmetic_binary($$[$0-3], $$[$0-1], arithmetic_binary_type.POWER, _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 79:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SQRT, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 80:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SIN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 81:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.COS, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 82:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.TAN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 83:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.LOG10, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 84:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESSOREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 85:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATEROREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 86:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.EQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 87:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.NOTEQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 88:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATER ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 89:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESS, _$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 90:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.AND ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 91:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.OR ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 92:

        this.$ = new string_unary($$[$0-4],string_unary_type.LENGTH ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 93:

        this.$ = new string_unary($$[$0-4],string_unary_type.UPPERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 94:

        this.$ = new string_unary($$[$0-4],string_unary_type.LOWERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 95:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.CONCAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 96:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.REPEAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 97:

        this.$ = new string_binary($$[$0-5], $$[$0-1],string_binary_type.POSITION ,_$[$0-5].first_line, _$[$0-5].first_column);
    
break;
case 98:

        this.$ = new string_ternary($$[$0-7], $$[$0-3], $$[$0-1], string_ternary_type.SUBSTRING ,_$[$0-7].first_line, _$[$0-7].first_column);
    
break;
case 99:

        this.$ = new ternary($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 100: case 104:

        this.$ = $$[$0]
    
break;
case 103:

        this.$ = new unary($$[$0], unary_type.LOGIC ,_$[$0-1].first_line, _$[$0-1].first_column);
    
break;
case 106:

        this.$ = new native($$[$0], type.FLOAT ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 107:

        this.$ = new native($$[$0], type.STRING ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 108:

        this.$ = new native($$[$0], type.NULL ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 109:

        this.$ = new native($$[$0], type.CHAR ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 110:

        this.$ = new native($$[$0], type.INTEGER ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 111:

        this.$ = new native($$[$0], type.BOOLEAN ,_$[$0].first_line, _$[$0].first_column);
    
break;
}
},
table: [{2:$V0,3:1,4:2,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{1:[3]},{2:$V0,5:[1,34],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},o($Vj,[2,28]),o($Vj,[2,29]),o($Vj,[2,30]),o($Vj,[2,31]),o($Vj,[2,32]),o($Vj,[2,33]),{17:[1,36]},{17:[1,37]},{17:[1,38]},{17:[1,39]},{17:[1,40]},{17:[1,41]},{11:[1,46],23:[1,44],25:[1,48],44:[1,42],45:[1,43],51:45,52:[1,47]},{11:$Vk,20:$Vl,24:49,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{17:[1,67]},o($Vj,[2,44]),{11:[1,68]},{11:[1,69]},{11:[1,70]},{13:[1,71]},{11:[1,72],20:[1,73]},{11:[1,74]},{20:[1,75],25:[1,76],27:77},{20:[1,78]},{11:[1,79]},{11:[1,80]},o($Vz,[2,22]),o($Vz,[2,23]),o($Vz,[2,24]),o($Vz,[2,25]),o($Vz,[2,26]),{1:[2,1]},o($Vj,[2,27]),o($Vj,[2,34]),o($Vj,[2,35]),o($Vj,[2,36]),o($Vj,[2,37]),o($Vj,[2,38]),o($Vj,[2,39]),{17:[1,81]},{17:[1,82]},{11:$Vk,20:$Vl,24:83,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{23:[1,84],25:[1,86],52:[1,85]},{11:$Vk,20:$Vl,24:88,33:$Vm,49:87,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{20:[1,89]},{11:$Vk,20:$Vl,24:90,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{17:[1,91],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{11:[1,109]},{11:[1,110]},{11:[1,111]},{11:[1,112]},{11:[1,113]},{11:[1,114]},o($VR,[2,100]),o($VR,[2,101],{97:[1,115]}),{11:$Vk,33:$Vm,96:116,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},o($VR,[2,104]),{11:$Vk,20:$Vl,24:117,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},o($VR,[2,106]),o($VR,[2,107]),o($VR,[2,108]),o($VR,[2,109]),o($VR,[2,110]),o($VR,[2,111]),o($Vj,[2,43]),{11:$Vk,20:$Vl,24:118,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:119,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:120,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{2:$V0,4:121,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{19:123,20:[1,124],29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,55:122},{56:[1,125]},{12:[1,126]},o($VS,[2,20],{23:[1,127]}),{26:[1,128]},{17:[2,18],22:[1,129]},{13:[1,130]},{11:$Vk,20:$Vl,24:88,33:$Vm,49:131,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:88,33:$Vm,49:132,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},o($Vj,[2,40]),o($Vj,[2,41]),{17:[2,47],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{11:$Vk,20:$Vl,24:133,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{20:[1,134]},{11:$Vk,20:$Vl,24:135,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{12:[1,136],22:$VT},o($VU,[2,56],{52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ}),o($VV,[2,51]),{26:[1,138],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},o($Vj,[2,42]),{11:$Vk,20:$Vl,24:139,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:140,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:141,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:142,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:143,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:144,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:145,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:146,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:147,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:148,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:149,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:150,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:151,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{88:[1,152],89:[1,153],90:[1,154],93:[1,155],94:[1,156]},{11:$Vk,20:$Vl,24:157,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:158,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:159,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:160,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:161,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:162,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:163,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:164,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:165,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},o($VR,[2,102]),o($VR,[2,103]),{12:[1,166],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{13:[1,167],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,168],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,169],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{2:$V0,14:[1,170],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{17:[1,171]},{20:[1,172]},{23:[1,173]},{11:$Vk,20:$Vl,24:174,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{17:[2,54]},{11:$Vk,20:$Vl,24:175,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{20:[1,176]},{20:[1,177]},{19:179,21:178,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},{12:[1,180],22:$VT},{12:[1,181],22:$VT},{17:[2,48],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},o($VV,[2,49]),{26:[1,182],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{17:[2,53]},{11:$Vk,20:$Vl,24:183,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},o($VV,[2,52]),o($VW,[2,73],{71:$VD,72:$VE,73:$VF}),o($VW,[2,74],{71:$VD,72:$VE,73:$VF}),o($VR,[2,75]),o($VR,[2,76]),o($VR,[2,77]),o($VX,[2,84],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF}),o($VX,[2,85],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF}),o($VY,[2,86],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,84:$VK,85:$VL}),o($VY,[2,87],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,84:$VK,85:$VL}),o($VX,[2,88],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF}),o($VX,[2,89],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF}),o([12,13,17,22,26,52,63,86,87,91,92,95],[2,90],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL}),o([12,13,17,22,26,52,63,87,91,92,95],[2,91],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM}),{11:[1,184]},{11:[1,185]},{11:[1,186]},{11:[1,187]},{11:[1,188]},o($VZ,[2,95],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,95:$VQ}),o($VZ,[2,96],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,95:$VQ}),{52:$VA,63:[1,189],69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{22:[1,190],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,191],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,192],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,193],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,194],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,195],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},o($VR,[2,105]),{2:$V0,4:196,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{13:[1,197]},{13:[1,198]},{57:[1,199]},{11:$Vk,20:$Vl,24:200,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{23:[1,201]},{11:$Vk,20:$Vl,24:202,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{13:[1,203],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{17:[2,16],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{23:[1,204]},o($VS,[2,19]),{14:[1,205],22:[1,206]},{20:[1,207]},{17:[2,45]},{17:[2,46]},o($VV,[2,50]),o($VU,[2,55],{52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ}),{12:[1,208]},{12:[1,209]},{12:[1,210]},{11:$Vk,20:$Vl,24:211,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:212,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:213,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:214,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},o($VR,[2,79]),o($VR,[2,80]),o($VR,[2,81]),o($VR,[2,82]),o($VR,[2,83]),{2:$V0,14:[1,215],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{60:216,61:217,62:$V_,64:$V$},{2:$V0,4:220,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{11:[1,221]},{17:[1,222],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{11:$Vk,20:$Vl,24:223,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{17:[2,60],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{2:$V0,4:224,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{11:$Vk,20:$Vl,24:225,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{17:[2,21]},{19:226,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},o($V01,[2,15]),o($VR,[2,92]),o($VR,[2,93]),o($VR,[2,94]),{12:[1,227],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{22:[1,228],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},o([12,13,17,22,26,52,63,91,92,95],[2,99],{69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN}),{12:[1,229],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},o($Vj,[2,69],{66:230,67:$V11,68:$V21}),{14:[1,233],61:234,62:$V_,64:$V$},o($V31,[2,65]),{19:235,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},{63:[1,236]},{2:$V0,14:[1,237],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{11:$Vk,20:$Vl,24:238,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{11:$Vk,20:$Vl,24:239,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{17:[2,59],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{2:$V0,14:[1,240],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{17:[2,17],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{20:[1,241]},o($VR,[2,97]),{11:$Vk,20:$Vl,24:242,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},o($VR,[2,78]),o($Vj,[2,68]),{11:[1,243]},{13:[1,244]},o($Vj,[2,63]),o($V31,[2,64]),{63:[1,245]},{2:$V0,4:246,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},o($Vj,[2,61]),{12:[1,247],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{12:[1,248],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},o($Vj,[2,58]),o($V01,[2,14]),{12:[1,249],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{11:$Vk,20:$Vl,24:250,33:$Vm,74:$Vn,75:$Vo,76:$Vp,77:$Vq,78:$Vr,79:$Vs,96:56,98:$Vt,99:59,100:$Vu,101:$Vv,102:$Vw,103:$Vx,104:$Vy},{2:$V0,4:251,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{2:$V0,4:252,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},o($V31,[2,67],{35:4,36:5,37:6,38:7,39:8,40:9,41:10,16:11,18:12,47:17,19:25,34:35,2:$V0,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,42:$V8,43:$V9,46:$Va,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi}),{17:[1,253]},{13:[1,254]},o($VR,[2,98]),{13:[1,255],52:$VA,69:$VB,70:$VC,71:$VD,72:$VE,73:$VF,80:$VG,81:$VH,82:$VI,83:$VJ,84:$VK,85:$VL,86:$VM,87:$VN,91:$VO,92:$VP,95:$VQ},{2:$V0,14:[1,256],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},o($V31,[2,66],{35:4,36:5,37:6,38:7,39:8,40:9,41:10,16:11,18:12,47:17,19:25,34:35,2:$V0,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,42:$V8,43:$V9,46:$Va,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi}),o($Vj,[2,62]),{2:$V0,4:257,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{2:$V0,4:258,16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:3,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},o($Vj,[2,72]),{2:$V0,14:[1,259],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},{2:$V0,14:[1,260],16:11,18:12,19:25,20:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:35,35:4,36:5,37:6,38:7,39:8,40:9,41:10,42:$V8,43:$V9,46:$Va,47:17,48:$Vb,50:$Vc,53:$Vd,54:$Ve,57:$Vf,58:$Vg,59:$Vh,65:$Vi},o($Vj,[2,57]),o($Vj,[2,71],{66:261,67:$V11,68:$V21}),o($Vj,[2,70])],
defaultActions: {34:[2,1],126:[2,54],136:[2,53],180:[2,45],181:[2,46],205:[2,21]},
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

    
    const {print, print_type} = require('../instruction/print');

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
case 5:return 93
break;
case 6:return 94
break;
case 7:return 88
break;
case 8:return 89
break;
case 9:return 90
break;
case 10:return 102
break;
case 11:return 104
break;
case 12:return 104
break;
case 13:return 74
break;
case 14:return 75
break;
case 15:return 76
break;
case 16:return 77
break;
case 17:return 78
break;
case 18:return 79
break;
case 19:return 29
break;
case 20:return 30
break;
case 21:return 33
break;
case 22:return 32
break;
case 23:return 31
break;
case 24:return 65
break;
case 25:return 68
break;
case 26:return 59
break;
case 27:return 62
break;
case 28:return 64
break;
case 29:return 42
break;
case 30:return 43
break;
case 31:return 57
break;
case 32:return 58
break;
case 33:return 54
break;
case 34:return 9
break;
case 35:return 10
break;
case 36:return 50
break;
case 37:return 48
break;
case 38:return 46
break;
case 39:return 28
break;
case 40:return 'tk_parse'
break;
case 41:return 'tk_toInt'
break;
case 42:return 'tk_toDouble'
break;
case 43:return 'tk_string_func'
break;
case 44:return 'tk_typeof'
break;
case 45:return 67
break;
case 46:return 42
break;
case 47:return 43
break;
case 48:return 56
break;
case 49:return 'tk_begin'
break;
case 50:return 'tk_end'
break;
case 51:return 'tk_push'
break;
case 52:return 'tk_pop'
break;
case 53:return 102
break;
case 54:return 100
break;
case 55:return 103
break;
case 56:return 101
break;
case 57:return 33
break;
case 58:return 20
break;
case 59:return 71
break;
case 60:return 72
break;
case 61:return 44
break;
case 62:return 45
break;
case 63:return 69
break;
case 64:return 70
break;
case 65:return 73
break;
case 66:return 80
break;
case 67:return 81
break;
case 68:return 85
break;
case 69:return 84
break;
case 70:return 82
break;
case 71:return 83
break;
case 72:return 87
break;
case 73:return 91
break;
case 74:return 86
break;
case 75:return 98
break;
case 76:return 23
break;
case 77:return 11
break;
case 78:return 12 
break;
case 79:return 13
break;
case 80:return 14
break;
case 81:return 25
break;
case 82:return 26
break;
case 83:return 22
break;
case 84:return 92
break;
case 85:return 52
break;
case 86:return 95
break;
case 87:return 63
break;
case 88:return 17
break;
case 89:return 97
break;
case 90:return 5
break;
case 91:error_arr.push(new error(yy_.yylloc.first_line, yy_.yylloc.first_column, error_type.LEXICO,'Valor inesperado ' + yy_.yytext));  
break;
}
},
rules: [/^(?:\s+)/,/^(?:\t)/,/^(?:\r)/,/^(?:\/\/.*)/,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:log10\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:boolean\b)/,/^(?:String\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:return\b)/,/^(?:struct\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:elseif\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:in\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:null\b)/,/^(?:([0-9]+(\.[0-9]+)))/,/^(?:([0-9]+))/,/^(?:(([\"][^"]*[\"])))/,/^(?:(([\'][^\']{1}[\'])))/,/^(?:(([a-zA-Z_])[a-zA-Z0-9_ñÑ]*))/,/^(?:\*)/,/^(?:\/)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:%)/,/^(?:<=)/,/^(?:>=)/,/^(?:<)/,/^(?:>)/,/^(?:==)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&)/,/^(?:&&)/,/^(?:!)/,/^(?:=)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?:\^)/,/^(?:\.)/,/^(?:\?)/,/^(?::)/,/^(?:;)/,/^(?:#)/,/^(?:$)/,/^(?:.)/],
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
},{"../expression/arithmetic_binary":8,"../expression/arithmetic_unary":9,"../expression/logic":10,"../expression/relational":11,"../expression/string_binary":12,"../expression/string_ternary":13,"../expression/string_unary":14,"../expression/ternary":15,"../expression/unary":16,"../instruction/print":18,"../literal/native":19,"../system/error":22,"../system/type":23,"_process":3,"fs":1,"path":2}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.print_type = void 0;
const instruction_1 = require("../abstract/instruction");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
var print_type;
(function (print_type) {
    print_type[print_type["PRINT"] = 0] = "PRINT";
    print_type[print_type["PRINTLN"] = 1] = "PRINTLN";
})(print_type = exports.print_type || (exports.print_type = {}));
class print extends instruction_1.instruction {
    constructor(expresions, type, line, column) {
        super(line, column);
        this.expresions = expresions;
        this.type = type;
    }
    translate(environment) {
        this.expresions.forEach(element => {
        });
        return type_1.type.NULL;
    }
    execute(environment) {
        this.expresions.forEach(element => {
            const expr_data = element.execute(environment);
            switch (this.type) {
                case print_type.PRINT:
                    console_1._console.output += expr_data.value;
                    break;
                case print_type.PRINTLN:
                    console_1._console.output += expr_data.value + "\n";
                    break;
            }
        });
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.print = print;

},{"../abstract/instruction":5,"../system/console":20,"../system/type":23}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native = void 0;
const literal_1 = require("../abstract/literal");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
class native extends literal_1.literal {
    constructor(value, type, line, column) {
        super(line, column);
        this.value = value;
        this.type = type;
    }
    translate(environment) {
        switch (this.type) {
            case type_1.type.INTEGER:
            case type_1.type.FLOAT:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + this.value + ';\n';
                break;
            case type_1.type.STRING:
            case type_1.type.CHAR:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = HP;//Save start position\n';
                let content = this.get_string_value(this.value);
                for (let i = 0; i < content.length; i++) {
                    console_1._3dCode.output += 'HEAP[(int)HP] = ' + content.charAt(i).charCodeAt(0) + ';//Save character ' + content.charAt(i) + ' in heap\n';
                    console_1._3dCode.output += 'HP = HP + 1;//Increase HP\n';
                }
                console_1._3dCode.output += 'HEAP[(int)HP] = 36;//Save end of string in heap\n';
                console_1._3dCode.output += 'HP = HP + 1;//Increase HP\n';
                break;
            case type_1.type.NULL:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' =  -1;\n';
                break;
            case type_1.type.BOOLEAN:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += (this.value === 'false') ? 'T' + console_1._3dCode.actualTemp + ' = 0;\n' : 'T' + console_1._3dCode.actualTemp + ' = 1;\n';
                break;
            default:
                console.log(this.value);
                return type_1.type.STRING;
        }
        return this.type;
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

},{"../abstract/literal":6,"../system/console":20,"../system/type":23}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._3dCode = exports._console = void 0;
class console {
    constructor() {
        this.output = "";
        this.symbols = new Map();
        this.stack = new Array;
        this.heap = new Array;
        this.actualTemp = 0;
        this.actualTag = 0;
        this.trueTag = 0;
        this.falseTag = 0;
        this.exitTag = 0;
    }
    saveInHeap(index, id) {
        this.heap[index] = id;
    }
    saveInStack(index, id) {
        this.stack[index] = id;
    }
    clean() {
        this.output = "";
        this.symbols = new Map();
        this.stack = [];
        this.heap = [];
        this.actualTemp = 0;
        this.actualTag = 0;
        this.trueTag = 0;
        this.falseTag = 0;
        this.exitTag = 0;
    }
}
exports._console = new console();
exports._3dCode = new console();

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./grammar/main_grammar");
const environment_1 = require("./system/environment");
const console_1 = require("./system/console");
const error_1 = require("./system/error");
window.translate = function (input) {
    console_1._3dCode.clean();
    try {
        const ast = parser.parse(input);
        const main_environment = new environment_1.environment(null);
        console.log("ast", ast);
        for (const instr of ast) {
            try {
                instr.translate(main_environment);
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
    console_1._3dCode.output = generateHeader() + generateDefaultFunctions() + console_1._3dCode.output + '}';
    console.log(console_1._3dCode.output);
    return console_1._console.output;
};
function generateHeader() {
    let code = '#include <stdio.h>\n';
    code += 'float HEAP[16384];\n';
    code += 'float STACK[16384];\n';
    code += 'float HP;\n';
    code += 'float SP;\n';
    code += 'float ';
    for (let i = 0; i <= console_1._3dCode.actualTemp; i++) {
        if (i == 0)
            code += 'T' + i;
        else
            code += ', T' + 1;
    }
    code += ';\n';
    return code;
}
function generateDefaultFunctions() {
    let code = generateStringConcat();
    code += generateStringPrint();
    code += generateOutOfBounds();
    code += generateDivisionBy0();
    code += generateLowerCase();
    code += generateUpperCase();
    code += generateStringTimes();
    code += generateNumberPower();
    code += generateIntToString();
    code += 'void main(){\n';
    return code;
}
function generateStringConcat() {
    let code = 'void StringConcat(){\n';
    code += 'T0 = SP + 1;//Get stack position of first string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of first string\n';
    code += 'T1 = HP;//Save first position of new string\n';
    code += 'L0://First loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L1;//Check if character is end of string\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L0;//Return to first loop\n';
    code += 'L1://Exit of first loop\n';
    code += 'T0 = SP + 2;//Get stack position of second string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of second string\n';
    code += 'L2://Second loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L3;//Check if character is end of string\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L2;//Return to second loop\n';
    code += 'L3://Exist of second loop\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;//Go back\n';
    code += '}\n';
    return code;
}
function generateStringPrint() {
    let code = 'void StringPrint(){\n';
    code += 'T0 = SP + 0;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'L0:\n';
    code += 'T1 = HEAP[(int)T0];\n';
    code += 'if(T1 == 36) goto L1;\n';
    code += 'printf("%c", (int)T1);\n';
    code += 'T0 = T0 + 1;\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateOutOfBounds() {
    let code = 'void OutOfBounds(){\n';
    code += 'printf("%c", 79); //O\n';
    code += 'printf("%c", 117); //u\n';
    code += 'printf("%c", 116); //t\n';
    code += 'printf("%c", 32); // \n';
    code += 'printf("%c", 111); //o\n';
    code += 'printf("%c", 102); //f\n';
    code += 'printf("%c", 32); // \n';
    code += 'printf("%c", 66); //B\n';
    code += 'printf("%c", 111); //o\n';
    code += 'printf("%c", 117); //u\n';
    code += 'printf("%c", 110); //n\n';
    code += 'printf("%c", 100); //d\n';
    code += 'printf("%c", 115); //s\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateDivisionBy0() {
    let code = 'void DivisionBy0(){\n';
    code += 'printf("%c", 68); //D\n';
    code += 'printf("%c", 105); //i\n';
    code += 'printf("%c", 118); //v\n';
    code += 'printf("%c", 105); //i\n';
    code += 'printf("%c", 115); //s\n';
    code += 'printf("%c", 105); //i\n';
    code += 'printf("%c", 111); //o\n';
    code += 'printf("%c", 110); //n\n';
    code += 'printf("%c", 32); // \n';
    code += 'printf("%c", 98); //b\n';
    code += 'printf("%c", 121); //y\n';
    code += 'printf("%c", 38); // \n';
    code += 'printf("%c", 48); //0\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateLowerCase() {
    let code = 'void StringLowerCase(){\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position\n';
    code += 'T1 = HP;//Save position of new string\n';
    code += 'L0://Loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L2;//Check if character is end of string\n';
    code += 'if(T2 < 65) goto L1;//Check if character < A\n';
    code += 'if(T2 > 90) goto L1;//Check if character > Z\n';
    code += 'T2 = T2 + 32;//Lower case\n';
    code += 'L1: //No need to lower case tag\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase hp\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Exit tag\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = SP + 0;//Get return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;//Go back\n';
    code += '}\n';
    return code;
}
function generateUpperCase() {
    let code = 'void StringUpperCase(){\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position\n';
    code += 'T1 = HP;//Save position of new string\n';
    code += 'L0://Loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L2;//Check if character is end of string\n';
    code += 'if(T2 < 97) goto L1;//Check if character < a\n';
    code += 'if(T2 > 122) goto L1;//Check if character > z\n';
    code += 'T2 = T2 - 32;//Lower case\n';
    code += 'L1: //No need to lower case tag\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase hp\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Exit tag\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = SP + 0;//Get return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;//Go back\n';
    code += '}\n';
    return code;
}
function generateStringTimes() {
    let code = 'void StringTimes(){\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of string\n';
    code += 'T1 = SP + 2;//Get number position\n';
    code += 'T1 = STACK[(int)T1];//Get number of times the string will repeat\n';
    code += 'T2 = HP;//Save start position of new string\n';
    code += 'L0://Loop tag\n';
    code += 'if(T1 < 1) goto L3;//Check if finish\n';
    code += 'L1://Second loop tag\n';
    code += 'T3 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T3 == 36) goto L2;//Check if character is end of string\n';
    code += 'HEAP[(int)HP] = T3;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase HP\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L1;//Go back to second loop\n';
    code += 'L2://End of string tag\n';
    code += 'T1 = T1 -1;//Update counter\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of string\n';
    code += 'goto L0;//Go back to first loop\n';
    code += 'L3://Exit tag\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string to new string\n';
    code += 'HP = HP + 1;//Increase HP\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T2;//Set return\n';
    code += 'return;//\n';
    code += '}';
    return code;
}
function generateNumberPower() {
    let code = 'void NumberPower(){\n';
    code += 'T0 = SP + 1;//Get base index\n';
    code += 'T0 = STACK[(int)T0];//Get base value\n';
    code += 'T1 = SP + 2;//Get exponent index\n';
    code += 'T1 = STACK[(int)T1];//Get exponent value\n';
    code += 'T2 = 1;//Set initial value\n';
    code += 'L0://Loop tag\n';
    code += 'if(T1 < 1) goto L1;//Check if completed\n';
    code += 'T2 = T2 * T0;//Previous value * Base\n';
    code += 'T1 = T1 - 1;//Iterator decreses\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1://Exit tag\n';
    code += 'T0 = SP + 0;//Set return index\n';
    code += 'STACK[(int)T0] = T2;//Set return value\n';
    code += 'return;//Go back\n';
    code += '}';
    return code;
}
function generateIntToString() {
    let code = 'void intToString(){\n';
    code += 'T0 = SP + 1; //Get number position\n';
    code += 'T0 = STACK[(int)T0]; //Get number\n';
    code += 'T1 = T0; //Make a copy\n';
    code += 'T2 = 1; //counter\n';
    code += 'L0:\n';
    code += 'if(T1 < 10) goto L1;\n';
    code += 'T3 = (int)T1 % 10; //temp%10\n';
    code += 'T1 = T1 - T3; //temp -= temp%10\n';
    code += 'T1 = T1 / 10; //temp /= 10\n';
    code += 'T2 = T2 * 10; //contador *= 10\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'T3 = T1 + 48; //Get ascii for number\n';
    code += 'HEAP[(int)HP] = T3;\n';
    code += 'HP = HP + 1;\n';
    code += 'if(T0 > 9) goto L2;\n';
    code += 'goto L3;\n';
    code += 'L2:\n';
    code += 'T1 = (int)T0 % (int)T2; //num %= contador\n';
    code += 'T0 = SP + 1; //Get number position\n';
    code += 'STACK[(int)T0] = T1;\n';
    code += 'intToString();\n';
    code += 'L3:\n';
    code += 'HEAP[(int)HP] = 36; //Set end of string\n';
    code += 'HP = HP + 1; //Increase HP\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}

},{"./grammar/main_grammar":17,"./system/console":20,"./system/environment":21,"./system/error":22}]},{},[24]);
