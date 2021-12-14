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

},{"../system/type":48,"./node":7}],5:[function(require,module,exports){
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
const console_1 = require("../system/console");
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
        const left_data = this.left.translate(environment);
        let leftTemp = console_1._3dCode.actualTemp;
        const right_data = this.right.translate(environment);
        let rightTemp = console_1._3dCode.actualTemp;
        const dominant_type = this.get_dominant_type(left_data, right_data);
        switch (this.type) {
            case arithmetic_binary_type.PLUS:
                switch (dominant_type) {
                    case type_1.type.STRING:
                        if (left_data === type_1.type.INTEGER || left_data === type_1.type.FLOAT) {
                            console_1._3dCode.actualTemp++;
                            const savedEnvironment = console_1._3dCode.actualTemp;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP;//Save environment\n';
                            console_1._3dCode.output += 'SP = 14;//Set IntToString environment\n';
                            console_1._3dCode.actualTemp++;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 1;//Set number position\n';
                            console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save number\n';
                            console_1._3dCode.actualTemp++;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = HP;//Save start position of new string\n';
                            leftTemp = console_1._3dCode.actualTemp;
                            console_1._3dCode.output += 'intToString();//Call function\n';
                            console_1._3dCode.actualTemp++;
                            const resultTemp = console_1._3dCode.actualTemp;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                            console_1._3dCode.actualTemp++;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                            console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        }
                        else if (right_data === type_1.type.INTEGER || right_data === type_1.type.FLOAT) {
                            console_1._3dCode.actualTemp++;
                            const savedEnvironment = console_1._3dCode.actualTemp;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP;//Save environment\n';
                            console_1._3dCode.output += 'SP = 14;//Set IntToString environment\n';
                            console_1._3dCode.actualTemp++;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 1;//Set number position\n';
                            console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save number\n';
                            console_1._3dCode.actualTemp++;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = HP;//Save start position of new string\n';
                            rightTemp = console_1._3dCode.actualTemp;
                            console_1._3dCode.output += 'intToString();//Call function\n';
                            console_1._3dCode.actualTemp++;
                            const resultTemp = console_1._3dCode.actualTemp;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                            console_1._3dCode.actualTemp++;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                            console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        }
                        console_1._3dCode.actualTemp++;
                        const savedEnvironment = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP;//Save environment\n';
                        console_1._3dCode.output += 'SP = 0;//Set IntToString environment\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 1;//Set string1 position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string1\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 2;//Set string2 position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save string2\n';
                        console_1._3dCode.output += 'StringConcat();//Call function\n';
                        console_1._3dCode.actualTemp++;
                        const resultTemp = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type_1.type.STRING;
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' + T' + rightTemp + ';\n';
                        return dominant_type;
                    default:
                }
                break;
            case arithmetic_binary_type.MINUS:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' - T' + rightTemp + ';\n';
                        return dominant_type;
                    default:
                }
                break;
            case arithmetic_binary_type.TIMES:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' * T' + rightTemp + ';\n';
                        return dominant_type;
                    default:
                }
                break;
            case arithmetic_binary_type.POWER:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        console_1._3dCode.actualTemp++;
                        const savedEnvironment = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP;//Save environment\n';
                        console_1._3dCode.output += 'SP = 11;//Set NumberPower environment\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 1;//Set base position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save base\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 2;//Set exponent position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save exponent\n';
                        console_1._3dCode.output += 'NumberPower();//Call function\n';
                        console_1._3dCode.actualTemp++;
                        const resultTemp = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type_1.type.INTEGER;
                    default:
                }
                break;
            case arithmetic_binary_type.MOD:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = (int)T' + leftTemp + ' % (int)T' + rightTemp + ';\n';
                        return type_1.type.FLOAT;
                    default:
                }
                break;
            case arithmetic_binary_type.DIV:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTag++;
                        const trueTag = console_1._3dCode.actualTag;
                        console_1._3dCode.actualTag++;
                        const falseTag = console_1._3dCode.actualTag;
                        console_1._3dCode.actualTag++;
                        const exitTag = console_1._3dCode.actualTag;
                        console_1._3dCode.output += 'if(T' + rightTemp + ' == 0) goto L' + trueTag + ';//Check if division by 0\n';
                        console_1._3dCode.output += 'goto L' + falseTag + ';\n';
                        console_1._3dCode.output += 'L' + trueTag + '://True tagn\n';
                        console_1._3dCode.output += 'DivisionBy0();//Call division by 0 error\n';
                        console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                        console_1._3dCode.output += 'L' + falseTag + '://False tag, operate division\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' / T' + rightTemp + ';\n';
                        console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                        console_1._3dCode.output += 'L' + exitTag + ':\n';
                        return type_1.type.FLOAT;
                    default:
                }
                break;
        }
        // Default
        return type_1.type.NULL;
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

},{"../abstract/expression":4,"../system/console":45,"../system/error":47,"../system/type":48}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arithmetic_unary = exports.arithmetic_unary_type = void 0;
const expression_1 = require("../abstract/expression");
const console_1 = require("../system/console");
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
        const exprType = this.expr.translate(environment);
        const exprTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case arithmetic_unary_type.SQRT:
                switch (exprType) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = sqrt(T' + exprTemp + ');//Get sqrt\n';
                        return type_1.type.FLOAT;
                    default:
                }
                break;
            case arithmetic_unary_type.COS:
                switch (exprType) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = cos(T' + exprTemp + ');//Get cos\n';
                        return type_1.type.FLOAT;
                    default:
                }
                break;
            case arithmetic_unary_type.SIN:
                switch (exprType) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = sin(T' + exprTemp + ');//Get sin\n';
                        return type_1.type.FLOAT;
                    default:
                }
                break;
            case arithmetic_unary_type.TAN:
                switch (exprType) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = tan(T' + exprTemp + ');//Get tan\n';
                        return type_1.type.FLOAT;
                    default:
                }
                break;
            case arithmetic_unary_type.LOG10:
                switch (exprType) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = log10(T' + exprTemp + ');//Get log10\n';
                        return type_1.type.FLOAT;
                    default:
                }
                break;
        }
        // Default
        return type_1.type.NULL;
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

},{"../abstract/expression":4,"../system/console":45,"../system/error":47,"../system/type":48}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_range = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class array_range extends expression_1.expression {
    constructor(left, right, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const left_data = (typeof this.left != 'string') ? this.left.execute(environment) : { type: type_1.type.STRING, value: this.left };
        const right_data = (typeof this.right != 'string') ? this.right.execute(environment) : { type: type_1.type.STRING, value: this.right };
        if (left_data.type != type_1.type.INTEGER && left_data.value != 'begin') {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Inicio de rango no valido: ' + left_data.value));
            return { value: null, type: type_1.type.NULL };
        }
        if (right_data.type != type_1.type.INTEGER && right_data.value != 'end') {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Fin de rango no valido: ' + right_data.value));
            return { value: null, type: type_1.type.NULL };
        }
        if (left_data.type == type_1.type.INTEGER && right_data.type == type_1.type.INTEGER && left_data.value >= right_data.value) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Inicio del rango tiene que ser mayor que el final'));
            return { value: null, type: type_1.type.NULL };
        }
        // Default
        return { value: [left_data.value, right_data.value], type: type_1.type.INTEGER };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.array_range = array_range;

},{"../abstract/expression":4,"../system/error":47,"../system/type":48}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logic = exports.logic_type = void 0;
const expression_1 = require("../abstract/expression");
const console_1 = require("../system/console");
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
        const leftType = this.left.translate(environment);
        const leftTemp = console_1._3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = console_1._3dCode.actualTemp;
        console_1._3dCode.actualTag++;
        const trueTag = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        const falseTag = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        const exitTag = console_1._3dCode.actualTag;
        switch (this.type) {
            case logic_type.AND:
                if (leftType === type_1.type.BOOLEAN && rightType == type_1.type.BOOLEAN) {
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'if(T' + leftTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                    console_1._3dCode.output += 'if(T' + rightTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                    console_1._3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'L' + trueTag + ':\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 0;//Set value to 0 (false)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + falseTag + ':\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 1;//Set value to 1 (true)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + exitTag + ':\n';
                }
                return type_1.type.BOOLEAN;
            case logic_type.OR:
                if (leftType === type_1.type.BOOLEAN && rightType == type_1.type.BOOLEAN) {
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'if(T' + leftTemp + ' == 1) goto L' + trueTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'if(T' + rightTemp + ' == 1) goto L' + trueTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'L' + trueTag + ':\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 1;//Set value to 1 (true)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + falseTag + ':\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 0;//Set value to 0 (false)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + exitTag + ':\n';
                }
                return type_1.type.BOOLEAN;
            default:
                return type_1.type.INTEGER;
        }
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

},{"../abstract/expression":4,"../system/console":45,"../system/type":48}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameter = void 0;
const expression_1 = require("../abstract/expression");
class parameter extends expression_1.expression {
    constructor(native_type, id, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.id = id;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        return { value: this.id, type: this.native_type };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.parameter = parameter;

},{"../abstract/expression":4}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relational = exports.relational_type = void 0;
const expression_1 = require("../abstract/expression");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
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
        const leftType = this.left.translate(environment);
        const leftTemp = console_1._3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case relational_type.EQUAL:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' == T' + rightTemp + ';\n';
                return type_1.type.BOOLEAN;
            case relational_type.NOTEQUAL:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' != T' + rightTemp + ';\n';
                return type_1.type.BOOLEAN;
            case relational_type.GREATER:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' > T' + rightTemp + ';\n';
                return type_1.type.BOOLEAN;
            case relational_type.GREATEROREQUAL:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' >= T' + rightTemp + ';\n';
                return type_1.type.BOOLEAN;
            case relational_type.LESS:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' < T' + rightTemp + ';\n';
                return type_1.type.BOOLEAN;
            case relational_type.LESSOREQUAL:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + leftTemp + ' <= T' + rightTemp + ';\n';
                return type_1.type.BOOLEAN;
            default:
                return type_1.type.INTEGER;
        }
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

},{"../abstract/expression":4,"../system/console":45,"../system/type":48}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_binary = exports.string_binary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
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
        const leftType = this.left.translate(environment);
        const leftTemp = console_1._3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case string_binary_type.CONCAT:
                if (leftType == type_1.type.STRING && rightType == type_1.type.STRING) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 0;//Set StringConcat environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set second String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save position\n';
                    console_1._3dCode.output += 'StringConcat();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    const resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.STRING;
                }
                else {
                }
                break;
            case string_binary_type.REPEAT:
                if (leftType == type_1.type.STRING && rightType == type_1.type.INTEGER) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 8;//Set StringConcat environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set second String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save position\n';
                    console_1._3dCode.output += 'StringTimes();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    const resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.STRING;
                }
                else {
                }
                break;
            case string_binary_type.POSITION:
                if (leftType == type_1.type.STRING && rightType == type_1.type.INTEGER) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 20;//Set StringPosition environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save position\n';
                    console_1._3dCode.output += 'StringPosition();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    const resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.STRING;
                }
                else {
                }
                break;
        }
        // Default
        return type_1.type.NULL;
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

},{"../abstract/expression":4,"../system/console":45,"../system/error":47,"../system/type":48}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_ternary = exports.string_ternary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
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
        const firstType = this.first.translate(environment);
        const firstTemp = console_1._3dCode.actualTemp;
        const secondType = this.second.translate(environment);
        const secondTemp = console_1._3dCode.actualTemp;
        const thirdType = this.third.translate(environment);
        const thirdTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case string_ternary_type.SUBSTRING:
                if (firstType == type_1.type.STRING && secondType == type_1.type.INTEGER && thirdType == type_1.type.INTEGER) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 23;//Set StringExtract environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + firstTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set start position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + secondTemp + ';//Save start position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 3;//Set end position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + thirdTemp + ';//Save end position\n';
                    console_1._3dCode.output += 'StringExtract();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    const resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.STRING;
                }
                else {
                }
                break;
        }
        // Default
        return type_1.type.NULL;
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

},{"../abstract/expression":4,"../system/console":45,"../system/error":47,"../system/type":48}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_unary = exports.string_unary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const _array_1 = require("../literal/_array");
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
        const exprType = this.expr.translate(environment);
        const leftTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case string_unary_type.LENGTH:
                switch (exprType) {
                    case type_1.type.STRING:
                        console_1._3dCode.actualTemp++;
                        const savedEnvironment = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        console_1._3dCode.output += 'SP = 18;//Set StringConcat environment\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                        console_1._3dCode.output += 'StringLength();//Call function\n';
                        console_1._3dCode.actualTemp++;
                        const resultTemp = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type_1.type.INTEGER;
                    default:
                }
                break;
            case string_unary_type.UPPERCASE:
                switch (exprType) {
                    case type_1.type.STRING:
                        console_1._3dCode.actualTemp++;
                        const savedEnvironment = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        console_1._3dCode.output += 'SP = 6;//Set StringConcat environment\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                        console_1._3dCode.output += 'StringUpperCase();//Call function\n';
                        console_1._3dCode.actualTemp++;
                        const resultTemp = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type_1.type.STRING;
                    default:
                }
                break;
            case string_unary_type.LOWERCASE:
                switch (exprType) {
                    case type_1.type.STRING:
                        console_1._3dCode.actualTemp++;
                        const savedEnvironment = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        console_1._3dCode.output += 'SP = 4;//Set StringConcat environment\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                        console_1._3dCode.output += 'StringLowerCase();//Call function\n';
                        console_1._3dCode.actualTemp++;
                        const resultTemp = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type_1.type.STRING;
                    default:
                }
                break;
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        switch (this.type) {
            case string_unary_type.LENGTH:
                switch (expr_data.type) {
                    case type_1.type.STRING:
                        let string_value = expr_data.value.toString();
                        //Posible error en el return, deberia de retornar INTEGER. Comprobar
                        return { value: string_value.length, type: type_1.type.STRING };
                    default:
                        if (expr_data.value instanceof _array_1._array) {
                            return { value: expr_data.value.body.length, type: type_1.type.INTEGER };
                        }
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

},{"../abstract/expression":4,"../literal/_array":41,"../system/console":45,"../system/error":47,"../system/type":48}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ternary = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
class ternary extends expression_1.expression {
    constructor(first, second, third, line, column) {
        super(line, column);
        this.first = first;
        this.second = second;
        this.third = third;
    }
    translate(environment) {
        const conditionType = this.first.translate(environment);
        const conditionTemp = console_1._3dCode.actualTemp;
        const trueType = this.second.translate(environment);
        const trueTemp = console_1._3dCode.actualTemp;
        const falseType = this.third.translate(environment);
        const falseTemp = console_1._3dCode.actualTemp;
        console_1._3dCode.actualTag++;
        const trueTag = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        const falseTag = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        const exitTag = console_1._3dCode.actualTag;
        if (conditionType == type_1.type.BOOLEAN) {
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'if(T' + conditionTemp + ' == 1) goto L' + trueTag + ';//Return true value\n';
            console_1._3dCode.output += 'goto L' + falseTag + ';//Return false value\n';
            console_1._3dCode.output += 'L' + trueTag + ':\n';
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + trueTemp + ';//Set true value\n';
            console_1._3dCode.output += 'goto L' + exitTag + ';\n';
            console_1._3dCode.output += 'L' + falseTag + ':\n';
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + falseTemp + ';//Set true value\n';
            console_1._3dCode.output += 'goto L' + exitTag + ';\n';
            console_1._3dCode.output += 'L' + exitTag + ':\n';
            return trueType;
        }
        else {
        }
        // Default
        return type_1.type.NULL;
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

},{"../abstract/expression":4,"../system/console":45,"../system/error":47,"../system/type":48}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unary = exports.unary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
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
        const exprType = this.expr.translate(environment);
        const exprTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case unary_type.ARITHMETIC:
                switch (exprType) {
                    case type_1.type.INTEGER:
                    case type_1.type.FLOAT:
                        console_1._3dCode.output = 'T' + exprTemp + ' = T' + exprTemp + ' * -1;\n';
                        return exprType;
                    default:
                }
                break;
            case unary_type.LOGIC:
                console_1._3dCode.actualTag++;
                const trueTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                const falseTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                const exitTag = console_1._3dCode.actualTag;
                switch (exprType) {
                    case type_1.type.BOOLEAN:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'if(T' + exprTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                        console_1._3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                        console_1._3dCode.output += 'L' + trueTag + ':\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + exprTemp + ' = 1;//Set value to 1 (true)\n';
                        console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                        console_1._3dCode.output += 'L' + falseTag + ':\n';
                        console_1._3dCode.output += 'T' + exprTemp + ' = 0;//Set value to 0 (false)\n';
                        console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                        console_1._3dCode.output += 'L' + exitTag + ':\n';
                        return type_1.type.BOOLEAN;
                    default:
                }
                break;
        }
        // Default
        return type_1.type.NULL;
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

},{"../abstract/expression":4,"../system/console":45,"../system/error":47,"../system/type":48}],19:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,10],$V2=[1,11],$V3=[1,12],$V4=[1,13],$V5=[1,14],$V6=[1,15],$V7=[5,8,26,27,28,29,30,31],$V8=[1,20],$V9=[2,24],$Va=[20,48,51],$Vb=[1,27],$Vc=[17,22],$Vd=[2,17],$Ve=[1,30],$Vf=[1,36],$Vg=[1,53],$Vh=[1,47],$Vi=[1,54],$Vj=[1,55],$Vk=[1,56],$Vl=[1,57],$Vm=[1,38],$Vn=[1,39],$Vo=[1,40],$Vp=[1,41],$Vq=[1,42],$Vr=[1,43],$Vs=[1,51],$Vt=[1,58],$Vu=[1,59],$Vv=[1,60],$Vw=[1,61],$Vx=[1,62],$Vy=[1,63],$Vz=[1,67],$VA=[1,83],$VB=[1,70],$VC=[1,71],$VD=[1,72],$VE=[1,73],$VF=[1,74],$VG=[1,75],$VH=[1,76],$VI=[1,77],$VJ=[1,78],$VK=[1,79],$VL=[1,80],$VM=[1,81],$VN=[1,82],$VO=[1,84],$VP=[1,85],$VQ=[1,86],$VR=[11,17,22,48,52,74,79,80,81,82,83,90,91,92,93,94,95,96,97,101,102,105],$VS=[2,114],$VT=[2,115],$VU=[2,117],$VV=[1,95],$VW=[1,96],$VX=[1,93],$VY=[2,120],$VZ=[1,97],$V_=[1,121],$V$=[1,127],$V01=[1,115],$V11=[1,116],$V21=[1,117],$V31=[1,129],$V41=[1,130],$V51=[1,126],$V61=[1,124],$V71=[1,125],$V81=[1,123],$V91=[1,122],$Va1=[11,14,22],$Vb1=[1,170],$Vc1=[2,8,10,14,20,26,27,28,29,30,31,42,43,44,58,59,62,63,64,65,67,68,69,70,73,75,76,84,85,86,87,88,89,112,114,115,116,117,118,119],$Vd1=[48,79,80,81,82,83,90,91,92,93,94,95,96,97,101,102,105],$Ve1=[1,195],$Vf1=[1,193],$Vg1=[1,194],$Vh1=[11,17,22,48,52,74,79,80,90,91,92,93,94,95,96,97,101,102,105],$Vi1=[11,17,22,48,52,74,90,91,92,93,94,95,96,97,101,102,105],$Vj1=[11,17,22,48,52,74,92,93,96,97,101,102,105],$Vk1=[11,17,22,48,52,74,101,102],$Vl1=[1,219],$Vm1=[11,22,52],$Vn1=[11,17],$Vo1=[11,17,22,48,51,52,74,79,80,81,82,83,90,91,92,93,94,95,96,97,101,102,105],$Vp1=[1,282],$Vq1=[1,283],$Vr1=[1,289],$Vs1=[14,73,75],$Vt1=[1,300],$Vu1=[22,52],$Vv1=[17,22,52];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"pr_init":3,"pr_globals":4,"EOF":5,"pr_global":6,"pr_main":7,"tk_void":8,"tk_main":9,"tk_par_o":10,"tk_par_c":11,"tk_cbra_o":12,"pr_instructions":13,"tk_cbra_c":14,"pr_declaration_function":15,"pr_declaration_list":16,"tk_semicolon":17,"pr_declare_struct":18,"pr_type":19,"tk_id":20,"pr_params":21,"tk_comma":22,"pr_declaration_item":23,"tk_equal":24,"pr_expr":25,"tk_struct":26,"tk_integer_type":27,"tk_double_type":28,"tk_string_type":29,"tk_boolean_type":30,"tk_char_type":31,"pr_instruction":32,"pr_if":33,"pr_switch":34,"pr_while":35,"pr_do":36,"pr_for":37,"pr_unary_instruction":38,"pr_assignation":39,"pr_call":40,"pr_declaration_array":41,"tk_break":42,"tk_continue":43,"tk_return":44,"pr_print":45,"pr_native_function":46,"pr_array_native_function":47,"tk_dot":48,"tk_push":49,"tk_pop":50,"tk_bra_o":51,"tk_bra_c":52,"pr_array":53,"pr_array_list":54,"pr_expression_list":55,"tk_double_plus":56,"tk_double_minus":57,"tk_print":58,"tk_println":59,"tk_parse":60,"pr_native_function_option":61,"tk_to_int":62,"tk_to_double":63,"tk_string_func":64,"tk_typeof":65,"pr_access":66,"tk_for":67,"tk_while":68,"tk_do":69,"tk_switch":70,"pr_cases":71,"pr_case":72,"tk_case":73,"tk_colon":74,"tk_default":75,"tk_if":76,"pr_else":77,"tk_else":78,"tk_plus":79,"tk_minus":80,"tk_times":81,"tk_division":82,"tk_mod":83,"tk_power":84,"tk_sqrt":85,"tk_sin":86,"tk_cos":87,"tk_tan":88,"tk_log10":89,"tk_less_equal":90,"tk_greater_equal":91,"tk_double_equal":92,"tk_not_equal":93,"tk_greater":94,"tk_less":95,"tk_and":96,"tk_or":97,"tk_length":98,"tk_uppercase":99,"tk_lowercase":100,"tk_concat":101,"tk_repeat":102,"tk_position":103,"tk_substring":104,"tk_ternary":105,"pr_unary":106,"tk_hash":107,"pr_index_list":108,"pr_array_range":109,"tk_begin":110,"tk_end":111,"tk_not":112,"pr_native":113,"tk_float":114,"tk_string":115,"tk_null":116,"tk_char":117,"tk_int":118,"tk_bool":119,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"tk_void",9:"tk_main",10:"tk_par_o",11:"tk_par_c",12:"tk_cbra_o",14:"tk_cbra_c",17:"tk_semicolon",20:"tk_id",22:"tk_comma",24:"tk_equal",26:"tk_struct",27:"tk_integer_type",28:"tk_double_type",29:"tk_string_type",30:"tk_boolean_type",31:"tk_char_type",42:"tk_break",43:"tk_continue",44:"tk_return",48:"tk_dot",49:"tk_push",50:"tk_pop",51:"tk_bra_o",52:"tk_bra_c",56:"tk_double_plus",57:"tk_double_minus",58:"tk_print",59:"tk_println",60:"tk_parse",62:"tk_to_int",63:"tk_to_double",64:"tk_string_func",65:"tk_typeof",67:"tk_for",68:"tk_while",69:"tk_do",70:"tk_switch",73:"tk_case",74:"tk_colon",75:"tk_default",76:"tk_if",78:"tk_else",79:"tk_plus",80:"tk_minus",81:"tk_times",82:"tk_division",83:"tk_mod",84:"tk_power",85:"tk_sqrt",86:"tk_sin",87:"tk_cos",88:"tk_tan",89:"tk_log10",90:"tk_less_equal",91:"tk_greater_equal",92:"tk_double_equal",93:"tk_not_equal",94:"tk_greater",95:"tk_less",96:"tk_and",97:"tk_or",98:"tk_length",99:"tk_uppercase",100:"tk_lowercase",101:"tk_concat",102:"tk_repeat",103:"tk_position",104:"tk_substring",105:"tk_ternary",107:"tk_hash",110:"tk_begin",111:"tk_end",112:"tk_not",114:"tk_float",115:"tk_string",116:"tk_null",117:"tk_char",118:"tk_int",119:"tk_bool"},
productions_: [0,[3,2],[4,2],[4,2],[4,1],[4,1],[7,7],[6,1],[6,2],[6,2],[15,8],[15,7],[21,4],[21,2],[16,3],[16,2],[23,3],[23,1],[18,5],[19,1],[19,1],[19,1],[19,1],[19,1],[19,1],[13,2],[13,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,2],[32,2],[32,2],[32,2],[32,2],[32,2],[32,2],[32,2],[32,3],[32,2],[32,2],[32,2],[32,1],[47,6],[47,5],[41,4],[41,4],[41,6],[41,6],[54,3],[54,1],[53,3],[53,3],[38,2],[38,2],[45,4],[45,4],[46,6],[46,4],[61,1],[61,1],[61,1],[61,1],[39,3],[66,3],[66,4],[66,2],[66,3],[40,4],[40,3],[55,3],[55,1],[37,11],[37,11],[35,7],[36,9],[34,7],[71,2],[71,1],[72,4],[72,3],[33,8],[33,7],[77,4],[77,2],[25,3],[25,3],[25,3],[25,3],[25,3],[25,6],[25,4],[25,4],[25,4],[25,4],[25,4],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,5],[25,5],[25,5],[25,3],[25,3],[25,6],[25,8],[25,5],[25,1],[25,1],[25,1],[25,1],[25,2],[25,2],[25,1],[108,4],[108,3],[109,1],[109,3],[109,3],[109,3],[106,2],[106,1],[106,3],[113,1],[113,1],[113,1],[113,1],[113,1],[113,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

        return $$[$0-1]
    
break;
case 2: case 3: case 25: case 79:

        $$[$0-1].push($$[$0])
        this.$ = $$[$0-1]
    
break;
case 4: case 5: case 26: case 52: case 73: case 80:

        this.$ = [$$[$0]]
    
break;
case 6:

        this.$ = new main($$[$0-1], _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 7: case 27: case 28: case 29: case 30: case 31:
this.$ = $$[$0]
break;
case 8: case 9: case 32: case 33: case 34: case 35: case 36: case 37: case 41: case 42: case 43:
this.$ = $$[$0-1]
break;
case 10:

        this.$ = new declaration_function($$[$0-7], $$[$0-6], $$[$0-4], $$[$0-1], _$[$0-7].first_line,_$[$0-7].first_column);
    
break;
case 11:

        this.$ = new declaration_function($$[$0-6], $$[$0-5], [], $$[$0-1], _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 12:

        $$[$0-3].push(new parameter($$[$0-1], $$[$0], _$[$0-3].first_line,_$[$0-3].first_column))
        this.$ = $$[$0-3]
    
break;
case 13:

        this.$ = [new parameter($$[$0-1], $$[$0], _$[$0-1].first_line,_$[$0-1].first_column)]
    
break;
case 14:

        $$[$0-2].add_to_list($$[$0])
        this.$ = $$[$0-2]
    
break;
case 15:

        this.$ = new declaration_list($$[$0-1], [$$[$0]], _$[$0-1].first_line,_$[$0-1].first_column)
    
break;
case 16:

        this.$ = new declaration_item($$[$0-2], $$[$0], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 17:

        this.$ = new declaration_item($$[$0], null, _$[$0].first_line,_$[$0].first_column);
    
break;
case 19:
this.$ = type.INTEGER
break;
case 20:
this.$ = type.FLOAT
break;
case 21:
this.$ = type.STRING
break;
case 22:
this.$ = type.BOOLEAN
break;
case 23:
this.$ = type.CHAR
break;
case 24:
this.$ = type.VOID
break;
case 38:
 
        this.$ = new _break($$[$0], _$[$0-1].first_line,_$[$0-1].first_column);
    
break;
case 39:
 
        this.$ = new _continue($$[$0], _$[$0-1].first_line,_$[$0-1].first_column);
    
break;
case 40:
 
        this.$ = new _return($$[$0-1], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 44:

        error_arr.push(new error(_$[$0].first_line, _$[$0].first_column, error_type.SINTACTICO, yytext));  
    
break;
case 45:

        this.$ = new array_native_function($$[$0-5], $$[$0-3], $$[$0-1], _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 46:

        this.$ = new array_native_function($$[$0-4], $$[$0-2], null, _$[$0-4].first_line,_$[$0-4].first_column);
    
break;
case 47:

        this.$ = new declaration_array($$[$0-3], $$[$0-2], null, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 48:

        this.$ = new declaration_array($$[$0-3], $$[$0], null, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 49:

        this.$ = new declaration_array($$[$0-5], $$[$0-4], $$[$0], _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 50:

        this.$ = new declaration_array($$[$0-5], $$[$0-2], $$[$0], _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 51: case 72:

        $$[$0-2].push($$[$0])
        this.$ = $$[$0-2]
    
break;
case 53: case 54:

        this.$ = new _array($$[$0-1], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 55:
 
        this.$ = new unary_instruction($$[$0-1], unary_instruction_type.INCREMENT, _$[$0-1].first_line,_$[$0-1].first_column);
    
break;
case 56:
 
        this.$ = new unary_instruction($$[$0-1], unary_instruction_type.DECREMENT, _$[$0-1].first_line,_$[$0-1].first_column);
    
break;
case 57:
 
        this.$ = new print($$[$0-1], print_type.PRINT, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 58:
 
        this.$ = new print($$[$0-1], print_type.PRINTLN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 59:
 
        this.$ = new native_parse($$[$0-5], $$[$0-1], _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 60:
 
        this.$ = new native_function($$[$0-3], $$[$0-1], _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 61: case 62: case 63: case 64:
 
        this.$ = $$[$0]
    
break;
case 65:

        this.$ = new assignation_unary($$[$0-2], $$[$0], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 70:

        this.$ = new call($$[$0-3], $$[$0-1], _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 71:

        this.$ = new call($$[$0-2], [], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 74: case 75:

        this.$ = new _for($$[$0-8], $$[$0-6], $$[$0-4], $$[$0-1], _$[$0-10].first_line,_$[$0-10].first_column);
    
break;
case 76:

        this.$ = new _while($$[$0-4], $$[$0-1], _while_type.NORMAL, _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 77:

        this.$ = new _while($$[$0-2], $$[$0-6], _while_type.DO, _$[$0-8].first_line,_$[$0-8].first_column);
    
break;
case 78:

        this.$ = new _switch($$[$0-4], $$[$0-1], _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 81:

        this.$ = new _case($$[$0-2], $$[$0], _case_type.CASE, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 82:

        this.$ = new _case(null, $$[$0], _case_type.DEFAULT, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 83:

        this.$ = new _if($$[$0-5], $$[$0-2], $$[$0], _$[$0-7].first_line,_$[$0-7].first_column);
    
break;
case 84:

        this.$ = new _if($$[$0-4], $$[$0-1], null, _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 85: case 129:

        this.$ = $$[$0-1]
    
break;
case 86: case 114: case 115: case 116: case 120: case 123: case 128:

        this.$ = $$[$0]
    
break;
case 87:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.PLUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 88:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MINUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 89:
 
        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.TIMES, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 90:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.DIV, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 91:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MOD, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 92:

        this.$ = new arithmetic_binary($$[$0-3], $$[$0-1], arithmetic_binary_type.POWER, _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 93:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SQRT, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 94:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SIN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 95:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.COS, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 96:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.TAN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 97:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.LOG10, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 98:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESSOREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 99:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATEROREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 100:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.EQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 101:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.NOTEQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 102:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATER ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 103:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESS, _$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 104:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.AND ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 105:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.OR ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 106:

        this.$ = new string_unary($$[$0-4],string_unary_type.LENGTH ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 107:

        this.$ = new string_unary($$[$0-4],string_unary_type.UPPERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 108:

        this.$ = new string_unary($$[$0-4],string_unary_type.LOWERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 109:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.CONCAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 110:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.REPEAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 111:

        this.$ = new string_binary($$[$0-5], $$[$0-1],string_binary_type.POSITION ,_$[$0-5].first_line, _$[$0-5].first_column);
    
break;
case 112:

        this.$ = new string_ternary($$[$0-7], $$[$0-3], $$[$0-1], string_ternary_type.SUBSTRING ,_$[$0-7].first_line, _$[$0-7].first_column);
    
break;
case 113:

        this.$ = new ternary($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 117:
 
        this.$ = new variable_id($$[$0], variable_id_type.NORMAL, _$[$0].first_line, _$[$0].first_column);
    
break;
case 118:
 
        this.$ = new variable_id($$[$0-1], variable_id_type.REFERENCE, _$[$0-1].first_line, _$[$0-1].first_column);
    
break;
case 119:

        this.$ = new array_access($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].first_column);
    
break;
case 121:

        $$[$0-3].push($$[$0-1])
        this.$ = $$[$0-3]
    
break;
case 122:

        this.$ = [$$[$0-1]]
    
break;
case 124: case 125: case 126:

        this.$ = new array_range($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 127:

        this.$ = new unary($$[$0], unary_type.LOGIC ,_$[$0-1].first_line, _$[$0-1].first_column);
    
break;
case 130:

        this.$ = new native($$[$0], type.FLOAT ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 131:

        this.$ = new native($$[$0], type.STRING ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 132:

        this.$ = new native($$[$0], type.NULL ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 133:

        this.$ = new native($$[$0], type.CHAR ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 134:

        this.$ = new native($$[$0], type.INTEGER ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 135:

        this.$ = new native($$[$0], type.BOOLEAN ,_$[$0].first_line, _$[$0].first_column);
    
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:$V0,15:5,16:6,18:7,19:9,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6},{1:[3]},{5:[1,16],6:17,7:18,8:$V0,15:5,16:6,18:7,19:9,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6},o($V7,[2,4]),o($V7,[2,5]),o($V7,[2,7]),{17:[1,19],22:$V8},{17:[1,21]},{9:[1,22],20:$V9},{20:[1,23],23:24},{20:[1,25]},o($Va,[2,19]),o($Va,[2,20]),o($Va,[2,21]),o($Va,[2,22]),o($Va,[2,23]),{1:[2,1]},o($V7,[2,2]),o($V7,[2,3]),o($V7,[2,8]),{20:$Vb,23:26},o($V7,[2,9]),{10:[1,28]},o($Vc,$Vd,{10:[1,29],24:$Ve}),o($Vc,[2,15]),{12:[1,31]},o($Vc,[2,14]),o($Vc,$Vd,{24:$Ve}),{11:[1,32]},{8:$Vf,11:[1,34],19:35,21:33,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6},{8:$Vf,10:$Vg,19:49,20:$Vh,25:37,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,19:35,21:64,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6},{12:[1,65]},{11:[1,66],22:$Vz},{12:[1,68]},{20:[1,69]},o($Va,$V9),o($Vc,[2,16],{48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ}),{10:[1,87]},{10:[1,88]},{10:[1,89]},{10:[1,90]},{10:[1,91]},{10:[1,92]},o($VR,$VS),o($VR,$VT),o($VR,[2,116]),o($VR,$VU,{108:94,10:$VV,51:$VW,107:$VX}),o($VR,$VY),{48:$VZ},{10:[1,98]},{10:$Vg,106:99,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($VR,[2,128]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:100,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{10:[2,61]},{10:[2,62]},{10:[2,63]},{10:[2,64]},o($VR,[2,130]),o($VR,[2,131]),o($VR,[2,132]),o($VR,[2,133]),o($VR,[2,134]),o($VR,[2,135]),{14:[1,101],22:$Vz},{2:$V_,8:$Vf,10:$Vg,13:102,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{12:[1,132]},{8:$Vf,19:133,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6},{2:$V_,8:$Vf,10:$Vg,13:134,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Va1,[2,13]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:135,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:136,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:137,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:138,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:139,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:140,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:141,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:142,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:143,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:144,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:145,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:146,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:147,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{49:[1,153],50:[1,154],98:[1,148],99:[1,149],100:[1,150],103:[1,151],104:[1,152]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:155,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:156,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:157,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:158,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:159,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:160,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:161,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:162,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:163,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($VR,[2,118]),o($VR,[2,119],{51:[1,164]}),{8:$Vf,10:$Vg,11:[1,166],19:49,20:$Vh,25:167,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,55:165,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:169,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,109:168,110:$Vb1,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{60:[1,171]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:172,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($VR,[2,127]),{11:[1,173],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{17:[2,18]},{2:$V_,8:$Vf,10:$Vg,14:[1,174],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vc1,[2,26]),o($Vc1,[2,27]),o($Vc1,[2,28]),o($Vc1,[2,29]),o($Vc1,[2,30]),o($Vc1,[2,31]),{17:[1,176]},{17:[1,177]},o($Vd1,$VT,{17:[1,178]}),{17:[1,179],22:$V8},{17:[1,180]},{17:[1,181]},{17:[1,182]},{17:[1,183]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:184,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{17:[1,185]},o($Vd1,$VS,{17:[1,186]}),o($Vd1,$VY,{17:[1,187]}),o($Vc1,[2,44]),{10:[1,188]},{10:[1,189]},{10:[1,190]},{12:[1,191]},{10:[1,192]},o($Vd1,$VU,{108:94,10:$VV,24:$Ve1,51:$VW,56:$Vf1,57:$Vg1,107:$VX}),{20:[1,196],23:24,48:$VZ,51:[1,197]},{10:[1,198]},{10:[1,199]},{48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{2:$V_,8:$Vf,10:$Vg,13:200,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{20:[1,201]},{2:$V_,8:$Vf,10:$Vg,14:[1,202],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vh1,[2,87],{81:$VD,82:$VE,83:$VF}),o($Vh1,[2,88],{81:$VD,82:$VE,83:$VF}),o($VR,[2,89]),o($VR,[2,90]),o($VR,[2,91]),o($Vi1,[2,98],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF}),o($Vi1,[2,99],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF}),o($Vj1,[2,100],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,94:$VK,95:$VL}),o($Vj1,[2,101],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,94:$VK,95:$VL}),o($Vi1,[2,102],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF}),o($Vi1,[2,103],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF}),o([11,17,22,48,52,74,96,97,101,102,105],[2,104],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL}),o([11,17,22,48,52,74,97,101,102,105],[2,105],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM}),{10:[1,203]},{10:[1,204]},{10:[1,205]},{10:[1,206]},{10:[1,207]},{10:[1,208]},{10:[1,209]},o($Vk1,[2,109],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,105:$VQ}),o($Vk1,[2,110],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,105:$VQ}),{48:$VA,74:[1,210],79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{22:[1,211],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,212],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,213],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,214],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,215],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,216],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{8:$Vf,10:$Vg,19:49,20:$Vh,25:169,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,109:217,110:$Vb1,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{11:[1,218],22:$Vl1},o($VR,[2,71]),o($Vm1,[2,73],{48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ}),{52:[1,220]},{48:$VA,52:[2,123],74:[1,221],79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{74:[1,222]},{10:[1,223]},{11:[1,224],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},o($VR,[2,129]),o($V7,[2,6]),o($Vc1,[2,25]),o($Vc1,[2,32]),o($Vc1,[2,33]),o($Vc1,[2,34]),o($Vc1,[2,35]),o($Vc1,[2,36]),o($Vc1,[2,37]),o($Vc1,[2,38]),o($Vc1,[2,39]),{17:[1,225],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},o($Vc1,[2,41]),o($Vc1,[2,42]),o($Vc1,[2,43]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:226,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:227,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:228,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{2:$V_,8:$Vf,10:$Vg,13:229,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,16:230,19:232,20:[1,233],27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,39:231},o($Vn1,[2,55]),o($Vn1,[2,56]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:234,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vc,$Vd,{24:$Ve,51:[1,235]}),{52:[1,236]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:167,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,55:237,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:167,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,55:238,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{2:$V_,8:$Vf,10:$Vg,14:[1,239],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Va1,[2,12]),o($V7,[2,11]),{11:[1,240]},{11:[1,241]},{11:[1,242]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:243,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:244,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:245,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{11:[1,246]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:247,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:248,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($VR,[2,93]),o($VR,[2,94]),o($VR,[2,95]),o($VR,[2,96]),o($VR,[2,97]),{52:[1,249]},o($VR,[2,70]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:250,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vo1,[2,122]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:252,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,111:[1,251],112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:253,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:254,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($VR,[2,60]),o($Vc1,[2,40]),{11:[1,255],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,256],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,257],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{2:$V_,8:$Vf,10:$Vg,14:[1,258],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{17:[1,259],22:$V8},{17:[1,260]},{20:$Vb,23:24},{24:$Ve1},{17:[2,65],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{52:[1,261]},{20:[1,262]},{11:[1,263],22:$Vl1},{11:[1,264],22:$Vl1},o($V7,[2,10]),o($VR,[2,106]),o($VR,[2,107]),o($VR,[2,108]),{11:[1,265],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{22:[1,266],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,267],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},o($VR,[2,46]),o([11,17,22,48,52,74,101,102,105],[2,113],{79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN}),{11:[1,268],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},o($Vo1,[2,121]),o($Vm1,[2,72],{48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ}),{52:[2,125]},{48:$VA,52:[2,126],79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{48:$VA,52:[2,124],79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,269],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{12:[1,270]},{12:[1,271]},{12:[1,272]},{68:[1,273]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:274,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:275,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{17:[2,47],24:[1,276]},{17:[2,48],24:[1,277]},{17:[2,57]},{17:[2,58]},o($VR,[2,111]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:278,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($VR,[2,45]),o($VR,[2,92]),o($VR,[2,59]),{2:$V_,8:$Vf,10:$Vg,13:279,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{71:280,72:281,73:$Vp1,75:$Vq1},{2:$V_,8:$Vf,10:$Vg,13:284,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{10:[1,285]},{17:[1,286],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{17:[1,287],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{51:$Vr1,53:288},{51:$Vr1,53:290},{11:[1,291],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{2:$V_,8:$Vf,10:$Vg,14:[1,292],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{14:[1,293],72:294,73:$Vp1,75:$Vq1},o($Vs1,[2,80]),{8:$Vf,10:$Vg,19:49,20:$Vh,25:295,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{74:[1,296]},{2:$V_,8:$Vf,10:$Vg,14:[1,297],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{8:$Vf,10:$Vg,19:49,20:$Vh,25:298,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{20:$Vt1,38:299},{20:$Vt1,38:301},{17:[2,49]},{8:$Vf,10:$Vg,19:49,20:$Vh,25:167,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,40:45,46:44,47:48,51:$Vr1,53:304,54:303,55:302,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{17:[2,50]},o($VR,[2,112]),o($Vc1,[2,84],{77:305,78:[1,306]}),o($Vc1,[2,78]),o($Vs1,[2,79]),{48:$VA,74:[1,307],79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{2:$V_,8:$Vf,10:$Vg,13:308,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vc1,[2,76]),{11:[1,309],48:$VA,79:$VB,80:$VC,81:$VD,82:$VE,83:$VF,90:$VG,91:$VH,92:$VI,93:$VJ,94:$VK,95:$VL,96:$VM,97:$VN,101:$VO,102:$VP,105:$VQ},{11:[1,310]},{56:$Vf1,57:$Vg1},{11:[1,311]},{22:$Vl1,52:[1,312]},{22:[1,314],52:[1,313]},o($Vu1,[2,52]),o($Vc1,[2,83]),{12:[1,315],33:316,76:$V91},{2:$V_,8:$Vf,10:$Vg,13:317,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vs1,[2,82],{106:46,61:50,113:52,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,16:112,18:113,41:114,45:118,46:119,47:120,19:128,25:131,32:175,2:$V_,8:$Vf,10:$Vg,20:$V$,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,42:$V01,43:$V11,44:$V21,58:$V31,59:$V41,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,112:$Vs,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy}),{17:[1,318]},{12:[1,319]},{12:[1,320]},o($Vv1,[2,53]),o($Vv1,[2,54]),{51:$Vr1,53:321},{2:$V_,8:$Vf,10:$Vg,13:322,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vc1,[2,86]),o($Vs1,[2,81],{106:46,61:50,113:52,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,16:112,18:113,41:114,45:118,46:119,47:120,19:128,25:131,32:175,2:$V_,8:$Vf,10:$Vg,20:$V$,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,42:$V01,43:$V11,44:$V21,58:$V31,59:$V41,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,112:$Vs,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy}),o($Vc1,[2,77]),{2:$V_,8:$Vf,10:$Vg,13:323,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{2:$V_,8:$Vf,10:$Vg,13:324,16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:103,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vu1,[2,51]),{2:$V_,8:$Vf,10:$Vg,14:[1,325],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{2:$V_,8:$Vf,10:$Vg,14:[1,326],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},{2:$V_,8:$Vf,10:$Vg,14:[1,327],16:112,18:113,19:128,20:$V$,25:131,26:$V1,27:$V2,28:$V3,29:$V4,30:$V5,31:$V6,32:175,33:104,34:105,35:106,36:107,37:108,38:109,39:110,40:111,41:114,42:$V01,43:$V11,44:$V21,45:118,46:119,47:120,58:$V31,59:$V41,61:50,62:$Vi,63:$Vj,64:$Vk,65:$Vl,67:$V51,68:$V61,69:$V71,70:$V81,76:$V91,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,106:46,112:$Vs,113:52,114:$Vt,115:$Vu,116:$Vv,117:$Vw,118:$Vx,119:$Vy},o($Vc1,[2,85]),o($Vc1,[2,74]),o($Vc1,[2,75])],
defaultActions: {16:[2,1],54:[2,61],55:[2,62],56:[2,63],57:[2,64],101:[2,18],251:[2,125],263:[2,57],264:[2,58],288:[2,49],290:[2,50]},
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
    const {parameter} = require('../expression/parameter');
    const {array_range} = require('../expression/array_range');

    
    const {print, print_type} = require('../instruction/print');
    const {declaration_list} = require('../instruction/declaration_list');
    const {declaration_item} = require('../instruction/declaration_item');
    const {assignation_unary} = require('../instruction/assignation_unary');
    const {native_parse} = require('../instruction/native_parse');
    const {native_function} = require('../instruction/native_function');
    const {declaration_function} = require('../instruction/declaration_function');
    const {main} = require('../instruction/main');
    const {call} = require('../instruction/call');
    const {_return} = require('../instruction/_return');
    const {_if} = require('../instruction/_if');
    const {_switch} = require('../instruction/_switch');
    const {_case, _case_type} = require('../instruction/_case');
    const {_break} = require('../instruction/_break');
    const {_continue} = require('../instruction/_continue');
    const {_while, _while_type} = require('../instruction/_while');
    const {unary_instruction, unary_instruction_type} = require('../instruction/unary_instruction');
    const {_for} = require('../instruction/_for');
    const {declaration_array} = require('../instruction/declaration_array');
    const {array_access} = require('../instruction/array_access');
    const {array_native_function} = require('../instruction/array_native_function');

    const {native} = require('../literal/native');
    const {variable_id, variable_id_type} = require('../literal/variable_id');
    const {_array} = require('../literal/_array');
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
case 5:return 103
break;
case 6:return 104
break;
case 7:return 98
break;
case 8:return 99
break;
case 9:return 100
break;
case 10:return 116
break;
case 11:return 119
break;
case 12:return 119
break;
case 13:return 84
break;
case 14:return 85
break;
case 15:return 86
break;
case 16:return 87
break;
case 17:return 88
break;
case 18:return 89
break;
case 19:return 27
break;
case 20:return 28
break;
case 21:return 31
break;
case 22:return 30
break;
case 23:return 29
break;
case 24:return 76
break;
case 25:return 78
break;
case 26:return 70
break;
case 27:return 73
break;
case 28:return 75
break;
case 29:return 42
break;
case 30:return 43
break;
case 31:return 68
break;
case 32:return 69
break;
case 33:return 67
break;
case 34:return 8
break;
case 35:return 9
break;
case 36:return 59
break;
case 37:return 58
break;
case 38:return 44
break;
case 39:return 26
break;
case 40:return 60
break;
case 41:return 62
break;
case 42:return 63
break;
case 43:return 64
break;
case 44:return 65
break;
case 45:return 42
break;
case 46:return 43
break;
case 47:return 'tk_in'
break;
case 48:return 110
break;
case 49:return 111
break;
case 50:return 49
break;
case 51:return 50
break;
case 52:return 116
break;
case 53:return 114
break;
case 54:return 118
break;
case 55:return 115
break;
case 56:return 117
break;
case 57:return 20
break;
case 58:return 81
break;
case 59:return 82
break;
case 60:return 56
break;
case 61:return 57
break;
case 62:return 79
break;
case 63:return 80
break;
case 64:return 83
break;
case 65:return 90
break;
case 66:return 91
break;
case 67:return 95
break;
case 68:return 94
break;
case 69:return 92
break;
case 70:return 93
break;
case 71:return 97
break;
case 72:return 96
break;
case 73:return 101
break;
case 74:return 112
break;
case 75:return 24
break;
case 76:return 10
break;
case 77:return 11 
break;
case 78:return 12
break;
case 79:return 14
break;
case 80:return 51
break;
case 81:return 52
break;
case 82:return 22
break;
case 83:return 102
break;
case 84:return 48
break;
case 85:return 105
break;
case 86:return 74
break;
case 87:return 17
break;
case 88:return 107
break;
case 89:return 5
break;
case 90:error_arr.push(new error(yy_.yylloc.first_line, yy_.yylloc.first_column, error_type.LEXICO,'Valor inesperado ' + yy_.yytext));  
break;
}
},
rules: [/^(?:\s+)/,/^(?:\t)/,/^(?:\r)/,/^(?:\/\/.*)/,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:log10\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:boolean\b)/,/^(?:String\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:return\b)/,/^(?:struct\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:in\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:null\b)/,/^(?:([0-9]+(\.[0-9]+)))/,/^(?:([0-9]+))/,/^(?:(([\"][^"]*[\"])))/,/^(?:(([\'][^\']{1}[\'])))/,/^(?:(([a-zA-Z_])[a-zA-Z0-9_ñÑ]*))/,/^(?:\*)/,/^(?:\/)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:%)/,/^(?:<=)/,/^(?:>=)/,/^(?:<)/,/^(?:>)/,/^(?:==)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:=)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?:\^)/,/^(?:\.)/,/^(?:\?)/,/^(?::)/,/^(?:;)/,/^(?:#)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90],"inclusive":true}}
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
},{"../expression/arithmetic_binary":8,"../expression/arithmetic_unary":9,"../expression/array_range":10,"../expression/logic":11,"../expression/parameter":12,"../expression/relational":13,"../expression/string_binary":14,"../expression/string_ternary":15,"../expression/string_unary":16,"../expression/ternary":17,"../expression/unary":18,"../instruction/_break":20,"../instruction/_case":21,"../instruction/_continue":22,"../instruction/_for":23,"../instruction/_if":24,"../instruction/_return":25,"../instruction/_switch":26,"../instruction/_while":27,"../instruction/array_access":28,"../instruction/array_native_function":29,"../instruction/assignation_unary":30,"../instruction/call":31,"../instruction/declaration_array":32,"../instruction/declaration_function":33,"../instruction/declaration_item":34,"../instruction/declaration_list":35,"../instruction/main":36,"../instruction/native_function":37,"../instruction/native_parse":38,"../instruction/print":39,"../instruction/unary_instruction":40,"../literal/_array":41,"../literal/native":42,"../literal/variable_id":43,"../system/error":47,"../system/type":48,"_process":3,"fs":1,"path":2}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._break = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class _break extends instruction_1.instruction {
    translate(environment) {
        console_1._3dCode.output += "goto L" + console_1._3dCode.breakTag + ";\n";
        return type_1.type.NULL;
    }
    constructor(line, column) {
        super(line, column);
    }
    execute(environment) {
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._break = _break;

},{"../abstract/instruction":5,"../system/console":45,"../system/type":48}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._case = exports._case_type = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
const _break_1 = require("./_break");
var _case_type;
(function (_case_type) {
    _case_type[_case_type["CASE"] = 0] = "CASE";
    _case_type[_case_type["DEFAULT"] = 1] = "DEFAULT";
})(_case_type = exports._case_type || (exports._case_type = {}));
class _case extends instruction_1.instruction {
    constructor(case_value, code, type, line, column) {
        super(line, column);
        this.case_value = case_value;
        this.code = code;
        this.type = type;
    }
    translate(environment) {
        if (this.type == _case_type.CASE) {
            this.case_value.translate(environment);
            const conditionTemp = console_1._3dCode.actualTemp;
            console_1._3dCode.actualTag++;
            let lTrue = console_1._3dCode.actualTag;
            console_1._3dCode.output += 'if(T' + conditionTemp + ' == T' + console_1._3dCode.switchEvaluation + ') goto L' + lTrue + ';\n';
            console_1._3dCode.actualTag++;
            let lFalse = console_1._3dCode.actualTag;
            console_1._3dCode.output += "goto L" + lFalse + ";\n";
            console_1._3dCode.actualTag++;
            let salida = console_1._3dCode.actualTag;
            console_1._3dCode.output += "L" + lTrue + ":\n";
            for (const instr of this.code) {
                try {
                    instr.translate(environment);
                }
                catch (error) {
                    console.log(error);
                }
            }
            console_1._3dCode.output += "goto L" + salida + ";\n";
            console_1._3dCode.output += "L" + salida + ":\n";
            console_1._3dCode.output += "L" + lFalse + ":\n";
        }
        else {
            console_1._3dCode.actualTag++;
            let salida = console_1._3dCode.actualTag;
            for (const instr of this.code) {
                try {
                    instr.translate(environment);
                }
                catch (error) {
                    console.log(error);
                }
            }
            console_1._3dCode.output += "goto L" + salida + ";\n";
            console_1._3dCode.output += "L" + salida + ":\n";
        }
        return type_1.type.NULL;
    }
    get_value() {
        return this.case_value;
    }
    execute(environment) {
        for (const instr of this.code) {
            const instr_data = instr.execute(environment);
            if (instr_data instanceof _break_1._break) {
                break;
            }
            else if (instr_data instanceof _return_1._return) {
                return instr_data;
            }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._case = _case;

},{"../abstract/instruction":5,"../system/console":45,"../system/type":48,"./_break":20,"./_return":25}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._continue = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class _continue extends instruction_1.instruction {
    translate(environment) {
        console_1._3dCode.output += "goto L" + console_1._3dCode.continueTag + ";\n";
        return type_1.type.NULL;
    }
    constructor(line, column) {
        super(line, column);
    }
    execute(environment) {
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._continue = _continue;

},{"../abstract/instruction":5,"../system/console":45,"../system/type":48}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._for = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
const _break_1 = require("./_break");
const _continue_1 = require("./_continue");
const assignation_unary_1 = require("./assignation_unary");
const declaration_list_1 = require("./declaration_list");
class _for extends instruction_1.instruction {
    constructor(initialization, condition, unary, code, line, column) {
        super(line, column);
        this.initialization = initialization;
        this.condition = condition;
        this.unary = unary;
        this.code = code;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        if (this.initialization instanceof assignation_unary_1.assignation_unary
            || this.initialization instanceof declaration_list_1.declaration_list) {
            this.initialization.execute(environment);
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La inicializacion del for tiene que ser una declaracion o asignacion'));
            // Default
            return { value: null, type: type_1.type.NULL };
        }
        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
            // Default
            return { value: null, type: type_1.type.NULL };
        }
        while (condition_data.value == true) {
            for (const instruction of this.code) {
                let instruction_data = instruction.execute(environment);
                if (instruction instanceof _return_1._return) {
                    return instruction_data;
                }
                else if (instruction instanceof _break_1._break) {
                    break;
                }
                else if (instruction instanceof _continue_1._continue) {
                    continue;
                }
            }
            this.unary.execute(environment);
            condition_data = this.condition.execute(environment);
            if (condition_data.type != type_1.type.BOOLEAN) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                // Default
                return { value: null, type: type_1.type.NULL };
            }
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._for = _for;

},{"../abstract/instruction":5,"../system/error":47,"../system/type":48,"./_break":20,"./_continue":22,"./_return":25,"./assignation_unary":30,"./declaration_list":35}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._if = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
class _if extends instruction_1.instruction {
    constructor(condition, code, else_statement, line, column) {
        super(line, column);
        this.condition = condition;
        this.code = code;
        this.else_statement = else_statement;
    }
    translate(environment) {
        this.condition.translate(environment);
        const conditionTemp = console_1._3dCode.actualTemp;
        console_1._3dCode.actualTag++;
        let lTrue = console_1._3dCode.actualTag;
        console_1._3dCode.output += "if(T" + conditionTemp + ") goto L" + lTrue + ";\n";
        console_1._3dCode.actualTag++;
        let lFalse = console_1._3dCode.actualTag;
        console_1._3dCode.output += "goto L" + lFalse + ";\n";
        console_1._3dCode.actualTag++;
        let salida = console_1._3dCode.actualTag;
        console_1._3dCode.output += "L" + lTrue + ":\n";
        for (const instr of this.code) {
            try {
                instr.translate(environment);
            }
            catch (error) {
                console.log(error);
            }
        }
        console_1._3dCode.output += "goto L" + salida + ";\n";
        console_1._3dCode.output += "L" + lFalse + ":\n";
        if (this.else_statement != null)
            if (this.else_statement instanceof instruction_1.instruction) {
                this.else_statement.translate(environment);
            }
            else if (this.else_statement instanceof Array) {
                for (const instr of this.else_statement) {
                    try {
                        instr.translate(environment);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        console_1._3dCode.output += "L" + salida + ":\n";
        return type_1.type.NULL;
    }
    execute(environment) {
        const condition = this.condition.execute(environment);
        // first check that the condition is a boolean
        if (condition.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion del if tiene que ser booleana'));
        }
        // if the condition is true execute the set of instructions
        if (condition.value == true) {
            for (const instr of this.code) {
                try {
                    const element_data = instr.execute(environment);
                    if (instr instanceof _return_1._return) {
                        return element_data;
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            // else if is another if
            if (this.else_statement instanceof instruction_1.instruction) {
                return this.else_statement.execute(environment);
            }
            // Else without condition is just a set of instructions 
            else if (this.else_statement instanceof Array) {
                for (const instr of this.else_statement) {
                    try {
                        const element_data = instr.execute(environment);
                        if (instr instanceof _return_1._return) {
                            return element_data;
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._if = _if;

},{"../abstract/instruction":5,"../system/console":45,"../system/error":47,"../system/type":48,"./_return":25}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._return = void 0;
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class _return extends instruction_1.instruction {
    constructor(return_value, line, column) {
        super(line, column);
        this.return_value = return_value;
    }
    translate(environment) {
        let returnType = this.return_value.translate(environment);
        console_1._3dCode.output += "goto L" + console_1._3dCode.breakTag + ";\n";
        return returnType;
    }
    execute(environment) {
        return this.return_value.execute(environment);
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._return = _return;

},{"../abstract/instruction":5,"../system/console":45}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._switch = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _case_1 = require("./_case");
class _switch extends instruction_1.instruction {
    constructor(switch_value, case_list, line, column) {
        super(line, column);
        this.switch_value = switch_value;
        this.case_list = case_list;
    }
    translate(environment) {
        this.switch_value.translate(environment);
        console_1._3dCode.switchEvaluation = console_1._3dCode.actualTemp;
        console_1._3dCode.actualTag++;
        let salida = console_1._3dCode.actualTag;
        console_1._3dCode.breakTag = salida;
        for (const case_instr of this.case_list) {
            case_instr.translate(environment);
        }
        console_1._3dCode.output += "L" + salida + ":\n";
        return type_1.type.NULL;
    }
    execute(environment) {
        const switch_value_data = this.switch_value.execute(environment);
        // comprobar tipos de los case
        for (const case_instr of this.case_list) {
            if (case_instr.type == _case_1._case_type.CASE) {
                const case_value_data = case_instr.get_value().execute(environment);
                if (case_value_data.type != switch_value_data.type) {
                    error_1.error_arr.push(new error_1.error(case_instr.line, case_instr.column, error_1.error_type.SEMANTICO, 'El case tiene tipo distinto al switch'));
                }
            }
        }
        // ejecutar los case
        let default_case;
        for (const case_instr of this.case_list) {
            // Guardar el default por si ningun case es verdadero
            if (case_instr.type == _case_1._case_type.DEFAULT) {
                default_case = case_instr;
            }
            else {
                const case_value_data = case_instr.get_value().execute(environment);
                if (case_value_data.value == switch_value_data.value) {
                    return case_instr.execute(environment);
                }
            }
        }
        return default_case ? default_case.execute(environment) : { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._switch = _switch;

},{"../abstract/instruction":5,"../system/console":45,"../system/error":47,"../system/type":48,"./_case":21}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._while = exports._while_type = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
const _break_1 = require("./_break");
const _continue_1 = require("./_continue");
var _while_type;
(function (_while_type) {
    _while_type[_while_type["NORMAL"] = 0] = "NORMAL";
    _while_type[_while_type["DO"] = 1] = "DO";
})(_while_type = exports._while_type || (exports._while_type = {}));
class _while extends instruction_1.instruction {
    constructor(condition, code, type, line, column) {
        super(line, column);
        this.condition = condition;
        this.code = code;
        this.type = type;
    }
    translate(environment) {
        console_1._3dCode.actualTag++;
        let startTag;
        let conditionType;
        let conditionTemp;
        let final;
        let tempBreak;
        let tempContinue;
        switch (this.type) {
            case _while_type.NORMAL:
                console_1._3dCode.actualTag++;
                startTag = console_1._3dCode.actualTag;
                console_1._3dCode.output += "L" + startTag + ":\n";
                conditionType = this.condition.translate(environment);
                conditionTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.actualTag++;
                let inicio = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                final = console_1._3dCode.actualTag;
                console_1._3dCode.output += "if(T" + conditionTemp + " == 1) goto L" + inicio + ";\n";
                console_1._3dCode.output += "goto L" + final + ";\n";
                console_1._3dCode.output += "L" + inicio + ":\n";
                tempContinue = console_1._3dCode.continueTag;
                console_1._3dCode.continueTag = startTag;
                tempBreak = console_1._3dCode.breakTag;
                console_1._3dCode.breakTag = final;
                for (const instruction of this.code) {
                    instruction.translate(environment);
                }
                console_1._3dCode.breakTag = tempBreak;
                console_1._3dCode.continueTag = tempContinue;
                console_1._3dCode.output += "goto L" + startTag + ";\n";
                console_1._3dCode.output += "L" + final + ":\n";
                break;
            case _while_type.DO:
                console_1._3dCode.actualTag++;
                startTag = console_1._3dCode.actualTag;
                console_1._3dCode.output += "L" + startTag + ":\n";
                console_1._3dCode.actualTag++;
                final = console_1._3dCode.actualTag;
                tempContinue = console_1._3dCode.continueTag;
                console_1._3dCode.continueTag = startTag;
                tempBreak = console_1._3dCode.breakTag;
                console_1._3dCode.breakTag = final;
                for (const instruction of this.code) {
                    instruction.translate(environment);
                }
                console_1._3dCode.breakTag = tempBreak;
                console_1._3dCode.continueTag = tempContinue;
                conditionType = this.condition.translate(environment);
                conditionTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.output += "if(T" + conditionTemp + " == 1) goto L" + startTag + ";\n";
                console_1._3dCode.output += "L" + final + ":\n";
                break;
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
            // Default
            return { value: null, type: type_1.type.NULL };
        }
        switch (this.type) {
            case _while_type.NORMAL:
                while (condition_data.value == true) {
                    for (const instruction of this.code) {
                        let instruction_data = instruction.execute(environment);
                        if (instruction instanceof _return_1._return) {
                            return instruction_data;
                        }
                        else if (instruction instanceof _break_1._break) {
                            break;
                        }
                        else if (instruction instanceof _continue_1._continue) {
                            continue;
                        }
                    }
                    condition_data = this.condition.execute(environment);
                    if (condition_data.type != type_1.type.BOOLEAN) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                    }
                }
                break;
            case _while_type.DO:
                do {
                    for (const instruction of this.code) {
                        let instruction_data = instruction.execute(environment);
                        if (instruction instanceof _return_1._return) {
                            return instruction_data;
                        }
                        else if (instruction instanceof _break_1._break) {
                            break;
                        }
                        else if (instruction instanceof _continue_1._continue) {
                            continue;
                        }
                    }
                    condition_data = this.condition.execute(environment);
                    if (condition_data.type != type_1.type.BOOLEAN) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                    }
                } while (condition_data.value == true);
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._while = _while;

},{"../abstract/instruction":5,"../system/console":45,"../system/error":47,"../system/type":48,"./_break":20,"./_continue":22,"./_return":25}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_access = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const _array_1 = require("../literal/_array");
class array_access extends instruction_1.instruction {
    constructor(id, dimensions, line, column) {
        super(line, column);
        this.id = id;
        this.dimensions = dimensions;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        let return_data = environment.get_variable(this.id);
        if (return_data.type != type_1.type.UNDEFINED) {
            if (return_data.value instanceof _array_1._array) {
                if (this.dimensions.length == 0) {
                    return return_data;
                }
                // validate that the array have the correct dimensions
                if (!return_data.value.check_dimensions_number(this.dimensions)) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Numero de dimensiones no validas para el array'));
                    return { value: null, type: type_1.type.NULL };
                }
                // and each have the correct length
                if (!return_data.value.check_dimensions_length(this.dimensions, environment)) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Index no valido'));
                    return { value: null, type: type_1.type.NULL };
                }
                let returned = return_data.value.get(this.dimensions, environment);
                // Get the type from the symbols table
                if (returned.type == type_1.type.UNDEFINED) {
                    returned.type = return_data.type;
                }
                return returned;
            }
            else {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no es un array: ' + this.id));
            }
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no definida: ' + this.id));
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.array_access = array_access;

},{"../abstract/instruction":5,"../literal/_array":41,"../system/error":47,"../system/type":48}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_native_function = void 0;
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const error_1 = require("../system/error");
const _array_1 = require("../literal/_array");
class array_native_function extends instruction_1.instruction {
    constructor(id, option, parameter, line, column) {
        super(line, column);
        this.id = id;
        this.option = option;
        this.parameter = parameter;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const return_data = this.id.execute(environment);
        if (!(return_data.value instanceof _array_1._array)) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no es un array'));
            return { value: null, type: type_1.type.NULL };
        }
        switch (this.option) {
            case "pop":
                let return_value = return_data.value.body.pop();
                if (return_value instanceof _array_1._array) {
                    return { value: return_value, type: return_data.type };
                }
                else if (return_value != null) {
                    return return_value.execute(environment);
                }
            case "push":
                if (this.parameter == null) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'El push no puede venir vacio'));
                    return { value: null, type: type_1.type.NULL };
                }
                const parameter_data = this.parameter.execute(environment);
                if (parameter_data.type != return_data.type) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'El parametro tiene que ser del mismo tipo de dato que el array'));
                    return { value: null, type: type_1.type.NULL };
                }
                return_data.value.body.push(this.parameter);
                return { value: parameter_data.value, type: parameter_data.type };
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.array_native_function = array_native_function;

},{"../abstract/instruction":5,"../literal/_array":41,"../system/error":47,"../system/type":48}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignation_unary = void 0;
const instruction_1 = require("../abstract/instruction");
const console_1 = require("../system/console");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class assignation_unary extends instruction_1.instruction {
    constructor(id, expr, line, column) {
        super(line, column);
        this.id = id;
        this.expr = expr;
    }
    translate(environment) {
        const exprType = this.expr.translate(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id);
        let absolutePos = environment.get_absolute(this.id);
        if (saved_variable.type != type_1.type.NULL) {
            // validate the type
            if (saved_variable.type == exprType) {
                // assign the value
                console_1._3dCode.output += 'STACK[' + absolutePos + '] = T' + console_1._3dCode.actualTemp + ';//Update value for variable ' + this.id + '\n';
            }
            else {
            }
        }
        else {
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id);
        if (saved_variable.type != type_1.type.NULL) {
            // validate the type
            if (saved_variable.type == expr_data.type) {
                // assign the value
                let absolutePos = environment.get_absolute(this.id);
                let relativePos = environment.get_relative(this.id);
                let size = environment.get_size(this.id);
                environment.save_variable(this.id, expr_data, absolutePos, relativePos, size);
            }
            else {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Tipo diferente, no se puede asignar'));
            }
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no inicializada'));
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.assignation_unary = assignation_unary;

},{"../abstract/instruction":5,"../system/console":45,"../system/error":47,"../system/type":48}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
const environment_1 = require("../system/environment");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const error_1 = require("../system/error");
const _return_1 = require("./_return");
class call extends instruction_1.instruction {
    constructor(id, parameters, line, column) {
        super(line, column);
        this.id = id;
        this.parameters = parameters;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(current_environment) {
        // the new environment to execute
        const new_environment = new environment_1.environment(current_environment);
        // Obtain the function
        let function_to_execute = current_environment.get_function(this.id);
        if (function_to_execute != null) {
            // check the type of the parameters to save them in a new environment
            if (this.parameters.length == function_to_execute.parameters.length) {
                for (let index = 0; index < this.parameters.length; index++) {
                    const call_parameter = this.parameters[index];
                    const call_parameter_data = call_parameter.execute(current_environment);
                    if (call_parameter_data.type == function_to_execute.parameters[index].native_type) {
                        new_environment.save_variable(function_to_execute.parameters[index].id, call_parameter_data, 0, 0, 0);
                    }
                    else {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Tipo de parametro incorrecto'));
                    }
                }
                // execute the code in the new environmet
                let return_data = { value: null, type: type_1.type.NULL };
                function_to_execute.code.forEach(instr => {
                    if (instr instanceof _return_1._return) {
                        return_data = instr.execute(new_environment);
                        return;
                    }
                    else {
                        instr.execute(new_environment);
                    }
                });
                // If the type is different to void check the return
                if ((function_to_execute.native_type != type_1.type.VOID && function_to_execute.native_type != return_data.type)
                    || (function_to_execute.native_type == type_1.type.VOID && type_1.type.NULL != return_data.type)) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Return de tipo incorrecto'));
                }
                else {
                    return return_data;
                }
            }
            else {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Numero de parametros incorrecto'));
            }
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La funcion no existe: ' + this.id));
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.call = call;

},{"../abstract/instruction":5,"../system/environment":46,"../system/error":47,"../system/type":48,"./_return":25}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_array = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class declaration_array extends instruction_1.instruction {
    constructor(type, variable_id, value, line, column) {
        super(line, column);
        this.type = type;
        this.variable_id = variable_id;
        this.value = value;
    }
    translate(environment) {
        // if is undefined save the variable with the type declared
        if (this.value == null) {
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
            }
            else {
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0);
            }
        }
        // if the save variable has an expression check types
        else {
            // Checking both types
            let checked = this.value.checkType(this.type, environment);
            // if checked type save the variable
            if (!checked) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + this.variable_id));
            }
            else {
                // Save the variable 
                if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                }
                else {
                    environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0);
                }
            }
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        // if is undefined save the variable with the type declared
        if (this.value == null) {
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
            }
            else {
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0);
            }
        }
        // if the save variable has an expression check types
        else {
            // Checking both types
            let checked = this.value.checkType(this.type, environment);
            // if checked type save the variable
            if (!checked) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + this.variable_id));
            }
            else {
                // Save the variable 
                if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                }
                else {
                    environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0);
                }
            }
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_array = declaration_array;

},{"../abstract/instruction":5,"../system/error":47,"../system/type":48}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_function = void 0;
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class declaration_function extends instruction_1.instruction {
    constructor(native_type, id, parameters, code, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.id = id;
        this.parameters = parameters;
        this.code = code;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        environment.save_function(this.id, this, 0, 0, 0);
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_function = declaration_function;

},{"../abstract/instruction":5,"../system/type":48}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_item = void 0;
const expression_1 = require("../abstract/expression");
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
const instruction_1 = require("../abstract/instruction");
class declaration_item extends instruction_1.instruction {
    constructor(variable_id, value, line, column) {
        super(line, column);
        this.variable_id = variable_id;
        this.value = value;
    }
    translate(environment) {
        if (this.value instanceof expression_1.expression || this.value instanceof literal_1.literal) {
            let valueType = this.value.translate(environment);
            return valueType;
        }
        else {
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        // If value is different to null then we need to operate the expresion
        let value_data = { value: null, type: type_1.type.NULL };
        if (this.value instanceof expression_1.expression || this.value instanceof literal_1.literal) {
            value_data = this.value.execute(environment);
        }
        return value_data;
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_item = declaration_item;

},{"../abstract/expression":4,"../abstract/instruction":5,"../abstract/literal":6,"../system/type":48}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_list = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class declaration_list extends instruction_1.instruction {
    constructor(native_type, declare_list, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.declare_list = declare_list;
    }
    translate(environment) {
        let tData = { value: null, type: type_1.type.NULL };
        this.declare_list.forEach(item => {
            let itemType = item.translate(environment);
            let itemTemp = console_1._3dCode.actualTemp;
            tData.type = itemType;
            if (itemType == type_1.type.NULL) {
                if (environment.get_variable(item.variable_id).value != null) {
                }
                else {
                    console_1._3dCode.output += 'STACK[' + console_1._3dCode.absolutePos + '] = 0;//Save variable ' + item.variable_id + '\n';
                    environment.save_variable(item.variable_id, tData, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
                    console_1._3dCode.absolutePos++;
                    console_1._3dCode.relativePos++;
                }
                return type_1.type.NULL;
            }
            else {
                let checked = false;
                if (itemType == this.native_type) {
                    checked = true;
                }
                if (!checked) {
                }
                else {
                    if (environment.get_variable(item.variable_id).value != null) {
                    }
                    else {
                        console_1._3dCode.output += 'STACK[' + console_1._3dCode.absolutePos + '] = T' + itemTemp + ';//Save variable ' + item.variable_id + '\n';
                        environment.save_variable(item.variable_id, tData, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
                        console_1._3dCode.absolutePos++;
                        console_1._3dCode.relativePos++;
                    }
                }
            }
        });
        // Default
        return type_1.type.NULL;
    }
    add_to_list(item) {
        this.declare_list.push(item);
    }
    execute(environment) {
        this.declare_list.forEach(item => {
            let item_data = item.execute(environment);
            // if is equal null save the variable with the type declared
            if (item_data.type == type_1.type.NULL) {
                // Save the variable 
                if (environment.get_variable(item.variable_id).type != type_1.type.UNDEFINED) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                }
                else {
                    environment.save_variable(item.variable_id, item_data, console_1._console.absolutePos, console_1._console.relativePos, 1);
                    console_1._console.absolutePos++;
                    console_1._console.relativePos++;
                }
                return;
            }
            // if the save variable has an expression check types
            else {
                // Checking both types
                let checked = false;
                if (item_data.type == this.native_type) {
                    checked = true;
                }
                // if checked type save the variable
                if (!checked) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + item.variable_id));
                }
                else {
                    // Save the variable 
                    if (environment.get_variable(item.variable_id).type != type_1.type.UNDEFINED) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                    }
                    else {
                        environment.save_variable(item.variable_id, item_data, console_1._console.absolutePos, console_1._console.relativePos, 1);
                        console_1._console.absolutePos++;
                        console_1._console.relativePos++;
                    }
                }
            }
        });
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_list = declaration_list;

},{"../abstract/instruction":5,"../system/console":45,"../system/error":47,"../system/type":48}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class main extends instruction_1.instruction {
    constructor(code, line, column) {
        super(line, column);
        this.code = code;
    }
    translate(environment) {
        console_1._3dCode.output += 'void main(){\n';
        this.code.forEach(element => {
            element.translate(environment);
        });
        console_1._3dCode.output += 'return;\n';
        console_1._3dCode.output += '}\n';
        return type_1.type.NULL;
    }
    execute(environment) {
        this.code.forEach(element => {
            element.execute(environment);
        });
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.main = main;

},{"../abstract/instruction":5,"../system/console":45,"../system/type":48}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native_function = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class native_function extends instruction_1.instruction {
    constructor(option, value, line, column) {
        super(line, column);
        this.option = option;
        this.value = value;
    }
    translate(environment) {
        let dataType = this.value.translate(environment);
        const dataTemp = console_1._3dCode.actualTemp;
        let savedEnvironment = 0;
        let resultTemp = 0;
        switch (this.option) {
            case "toInt":
                if (dataType == type_1.type.FLOAT) {
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = (int)T' + dataTemp + ';//Change value to int\n';
                    return type_1.type.INTEGER;
                }
                else if (dataType == type_1.type.STRING) {
                    console_1._3dCode.actualTemp++;
                    savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                    console_1._3dCode.output += 'StringToInt();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.INTEGER;
                }
            case "toDouble":
                if (dataType == type_1.type.INTEGER) {
                    return type_1.type.FLOAT;
                }
                else if (dataType == type_1.type.STRING) {
                    console_1._3dCode.actualTemp++;
                    savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                    console_1._3dCode.output += 'StringToFloat();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.FLOAT;
                }
            case "string":
                return type_1.type.STRING;
            case "typeof":
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                console_1._3dCode.output += 'SP = 27;//Set StringConcat environment\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set number position\n';
                switch (dataType) {
                    case type_1.type.STRING:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 0;//Save number\n';
                        break;
                    case type_1.type.INTEGER:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 1;//Save number\n';
                        break;
                    case type_1.type.FLOAT:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 2;//Save number\n';
                        break;
                    case type_1.type.CHAR:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 3;//Save number\n';
                        break;
                    case type_1.type.BOOLEAN:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 4;//Save number\n';
                        break;
                    case type_1.type.NULL:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 6;//Save number\n';
                        break;
                    default:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 5;//Save number\n';
                        break;
                }
                console_1._3dCode.output += 'getTypeOf();//Call function\n';
                console_1._3dCode.actualTemp++;
                resultTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                return type_1.type.STRING;
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        let value_data = this.value.execute(environment);
        switch (this.option) {
            case "toInt":
                try {
                    return { value: parseInt(value_data.value), type: type_1.type.INTEGER };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case "toDouble":
                try {
                    return { value: parseFloat(value_data.value), type: type_1.type.FLOAT };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case "string":
                try {
                    return { value: String(value_data.value), type: type_1.type.STRING };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a string el valor ' + value_data.value));
                }
            case "typeof":
                return { value: type_1.type[value_data.type], type: type_1.type.STRING };
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.native_function = native_function;

},{"../abstract/instruction":5,"../system/console":45,"../system/error":47,"../system/type":48}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native_parse = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class native_parse extends instruction_1.instruction {
    constructor(native_type, value, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.value = value;
    }
    translate(environment) {
        const dataType = this.value.translate(environment);
        const dataTemp = console_1._3dCode.actualTemp;
        let savedEnvironment = 0;
        let resultTemp = 0;
        switch (this.native_type) {
            case type_1.type.INTEGER:
                console_1._3dCode.actualTemp++;
                savedEnvironment = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                console_1._3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                console_1._3dCode.output += 'StringToInt();//Call function\n';
                console_1._3dCode.actualTemp++;
                resultTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                return type_1.type.INTEGER;
            case type_1.type.FLOAT:
                console_1._3dCode.actualTemp++;
                savedEnvironment = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                console_1._3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                console_1._3dCode.output += 'StringToFloat();//Call function\n';
                console_1._3dCode.actualTemp++;
                resultTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                return type_1.type.FLOAT;
            case type_1.type.BOOLEAN:
                console_1._3dCode.actualTag++;
                const trueTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                const falseTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                const exitTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + '= HEAP[(int)T' + dataTemp + '];//Get character\n';
                console_1._3dCode.output += 'if(T' + console_1._3dCode.actualTemp + ' == 48) goto L' + trueTag + ';//Check if 0\n';
                console_1._3dCode.output += 'goto L' + falseTag + ';\n';
                console_1._3dCode.output += 'L' + trueTag + '://True tag\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 0;\n';
                console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                console_1._3dCode.output += 'L' + falseTag + '://False tag\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 1;\n';
                console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                console_1._3dCode.output += 'L' + exitTag + ':\n';
                return type_1.type.BOOLEAN;
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        let value_data = this.value.execute(environment);
        switch (this.native_type) {
            case type_1.type.INTEGER:
                try {
                    return { value: parseInt(value_data.value), type: type_1.type.INTEGER };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case type_1.type.FLOAT:
                try {
                    return { value: parseFloat(value_data.value), type: type_1.type.FLOAT };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case type_1.type.BOOLEAN:
                try {
                    return { value: Boolean(value_data.value), type: type_1.type.BOOLEAN };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a boolean el valor ' + value_data.value));
                }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.native_parse = native_parse;

},{"../abstract/instruction":5,"../system/console":45,"../system/error":47,"../system/type":48}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.print_type = void 0;
const instruction_1 = require("../abstract/instruction");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const _array_1 = require("../literal/_array");
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
            const elementType = element.translate(environment);
            switch (elementType) {
                case type_1.type.BOOLEAN:
                    console_1._3dCode.actualTag++;
                    const trueTag = console_1._3dCode.actualTag;
                    console_1._3dCode.actualTag++;
                    const falseTag = console_1._3dCode.actualTag;
                    console_1._3dCode.actualTag++;
                    const exitTag = console_1._3dCode.actualTag;
                    console_1._3dCode.output += 'if(T' + console_1._3dCode.actualTemp + ' == 0) goto L' + trueTag + ';//Check if False\n';
                    console_1._3dCode.output += 'goto L' + falseTag + ';\n';
                    console_1._3dCode.output += 'L' + trueTag + '://True tag\n';
                    console_1._3dCode.output += 'printf("%c", 70);//Print F\n';
                    console_1._3dCode.output += 'printf("%c", 97);//Print a\n';
                    console_1._3dCode.output += 'printf("%c", 108);//Print l\n';
                    console_1._3dCode.output += 'printf("%c", 115);//Print s\n';
                    console_1._3dCode.output += 'printf("%c", 101);//Print e\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + falseTag + '://True tag\n';
                    console_1._3dCode.output += 'printf("%c", 84);//Print T\n';
                    console_1._3dCode.output += 'printf("%c", 114);//Print r\n';
                    console_1._3dCode.output += 'printf("%c", 117);//Print u\n';
                    console_1._3dCode.output += 'printf("%c", 101);//Print e\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + exitTag + ':\n';
                    break;
                case type_1.type.CHAR:
                case type_1.type.STRING:
                    const elementTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 3;//Set StringPrint environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 0;//Set string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + elementTemp + ';//Save string\n';
                    console_1._3dCode.output += 'StringPrint();//Call function\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    break;
                case type_1.type.INTEGER:
                    console_1._3dCode.output += 'printf("%d", (int)T' + console_1._3dCode.actualTemp + ');//Print integer\n';
                    break;
                case type_1.type.FLOAT:
                    console_1._3dCode.output += 'printf("%f", T' + console_1._3dCode.actualTemp + ');//Print float\n';
                    break;
                default:
                    break;
            }
            switch (this.type) {
                case print_type.PRINTLN:
                    console_1._3dCode.output += 'printf("%c", 10);//Print new line\n';
                    break;
            }
        });
        return type_1.type.NULL;
    }
    execute(environment) {
        this.expresions.forEach(element => {
            const expr_data = element.execute(environment);
            let print_str = expr_data.value;
            // if is an array convert to string first 
            if (expr_data.value instanceof _array_1._array) {
                print_str = expr_data.value.to_string(environment);
            }
            switch (this.type) {
                case print_type.PRINT:
                    console_1._console.output += print_str;
                    break;
                case print_type.PRINTLN:
                    console_1._console.output += print_str + "\n";
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

},{"../abstract/instruction":5,"../literal/_array":41,"../system/console":45,"../system/type":48}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unary_instruction = exports.unary_instruction_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
var unary_instruction_type;
(function (unary_instruction_type) {
    unary_instruction_type[unary_instruction_type["INCREMENT"] = 0] = "INCREMENT";
    unary_instruction_type[unary_instruction_type["DECREMENT"] = 1] = "DECREMENT";
})(unary_instruction_type = exports.unary_instruction_type || (exports.unary_instruction_type = {}));
class unary_instruction extends expression_1.expression {
    constructor(variable_id, type, line, column) {
        super(line, column);
        this.variable_id = variable_id;
        this.type = type;
    }
    translate(environment) {
        const variable_data = environment.get_variable(this.variable_id);
        if (variable_data.type == type_1.type.NULL) {
            return type_1.type.NULL;
        }
        let absolutePos = environment.get_absolute(this.variable_id);
        switch (this.type) {
            case unary_instruction_type.INCREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[' + absolutePos + '];//Get value of variable ' + this.variable_id + '\n';
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + 1;\n';
                        console_1._3dCode.output += 'STACK[' + absolutePos + '] = T' + console_1._3dCode.actualTemp + ';//Update value of variable ' + this.variable_id + '\n';
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar ++ para: ' + variable_data.value));
                }
                break;
            case unary_instruction_type.DECREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[' + absolutePos + '];//Get value of variable ' + this.variable_id + '\n';
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' - 1;\n';
                        console_1._3dCode.output += 'STACK[' + absolutePos + '] = T' + console_1._3dCode.actualTemp + ';//Update value of variable ' + this.variable_id + '\n';
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar -- para: ' + variable_data.value));
                }
                break;
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        const variable_data = environment.get_variable(this.variable_id);
        if (variable_data.type == type_1.type.NULL) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no existente'));
            return { value: null, type: type_1.type.NULL };
        }
        switch (this.type) {
            case unary_instruction_type.INCREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        variable_data.value++;
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar ++ para: ' + variable_data.value));
                }
                break;
            case unary_instruction_type.DECREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        variable_data.value--;
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar -- para: ' + variable_data.value));
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
exports.unary_instruction = unary_instruction;

},{"../abstract/expression":4,"../system/console":45,"../system/error":47,"../system/type":48}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._array = void 0;
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
const array_range_1 = require("../expression/array_range");
class _array extends literal_1.literal {
    constructor(body, line, column) {
        super(line, column);
        this.body = body;
    }
    translate(environment) {
        // Default
        return type_1.type.NULL;
    }
    check_dimensions_number(dimensions) {
        let checked = false;
        let body_pointer = this.body;
        let dimensions_counter = 1;
        let dimensions_index = 0;
        while (dimensions_index < dimensions.length) {
            if (dimensions[dimensions_index] instanceof array_range_1.array_range) {
                dimensions_counter++;
                dimensions_index++;
            }
            else if (body_pointer[0] instanceof _array) {
                body_pointer = body_pointer[0].body;
                dimensions_counter++;
                dimensions_index++;
            }
            else {
                dimensions_index++;
            }
        }
        if (dimensions_index <= dimensions_counter) {
            checked = true;
        }
        return checked;
    }
    check_dimensions_length(dimensions, environment) {
        let body_pointer = this.body;
        let dimensions_index = 0;
        while (dimensions_index < dimensions.length) {
            let dimension_data = dimensions[dimensions_index].execute(environment);
            if (dimension_data.value instanceof Array) {
                let first_index = (dimension_data.value[0] == "begin") ? 0 : dimension_data.value[0];
                let last_index = (dimension_data.value[1] == "end") ? (body_pointer.length - 1) : dimension_data.value[1];
                if (first_index < 0 || last_index >= body_pointer.length) {
                    return false;
                }
                body_pointer = body_pointer.slice(first_index, last_index + 1);
                dimensions_index++;
            }
            else if (body_pointer[0] instanceof _array) {
                if (dimension_data.value < 0 || dimension_data.value >= body_pointer.length) {
                    return false;
                }
                body_pointer = body_pointer[0].body;
                dimensions_index++;
            }
            else {
                if (dimension_data.value < 0 || dimension_data.value >= body_pointer.length) {
                    return false;
                }
                dimensions_index++;
            }
        }
        return true;
    }
    get(dimensions, environment) {
        // get first data 
        let dimension_data = dimensions[0].execute(environment);
        dimensions.shift();
        // if the dimension is a range obtain by range
        if (dimension_data.value instanceof Array) {
            let first_index = (dimension_data.value[0] == "begin") ? 0 : dimension_data.value[0];
            let last_index = (dimension_data.value[1] == "end") ? (this.body.length - 1) : dimension_data.value[1];
            let arr_return = new _array(this.body.slice(first_index, last_index + 1), this.line, this.column);
            if (dimensions.length > 0) {
                return arr_return.get(dimensions, environment);
            }
            else {
                return { type: type_1.type.UNDEFINED, value: arr_return };
            }
        }
        else {
            // iterate trought the array and return the value
            let item = this.body[dimension_data.value];
            if (item instanceof _array && dimensions.length > 0) {
                return item.get(dimensions, environment);
            }
            else {
                return item.execute(environment);
            }
        }
    }
    checkType(type, environment) {
        let return_bool = true;
        for (const item of this.body) {
            if (item instanceof _array) {
                return_bool = item.checkType(type, environment);
                // if one of all elements have another type return false
                if (!return_bool)
                    return false;
            }
            else {
                return_bool = (item.execute(environment).type == type);
                // if one of all elements have another type return false
                if (!return_bool)
                    return false;
            }
        }
        return return_bool;
    }
    translateElements(environment) {
        for (const item of this.body) {
            if (item instanceof _array) {
                item.translateElements(environment);
            }
            else {
                item.translate(environment);
            }
        }
    }
    to_string(environment) {
        let result_str = "[";
        for (const item of this.body) {
            if (item instanceof _array) {
                result_str += item.to_string(environment) + ",";
            }
            else {
                result_str += item.execute(environment).value + ",";
            }
        }
        // remove comma
        result_str = result_str.substring(0, result_str.length - 1);
        return result_str + "]";
    }
    execute(environment) {
        // Default
        return { value: this, type: type_1.type.UNDEFINED };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._array = _array;

},{"../abstract/literal":6,"../expression/array_range":10,"../system/type":48}],42:[function(require,module,exports){
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

},{"../abstract/literal":6,"../system/console":45,"../system/type":48}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable_id = exports.variable_id_type = void 0;
const literal_1 = require("../abstract/literal");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const error_1 = require("../system/error");
var variable_id_type;
(function (variable_id_type) {
    variable_id_type[variable_id_type["NORMAL"] = 0] = "NORMAL";
    variable_id_type[variable_id_type["REFERENCE"] = 1] = "REFERENCE";
})(variable_id_type = exports.variable_id_type || (exports.variable_id_type = {}));
class variable_id extends literal_1.literal {
    constructor(id, type, line, column) {
        super(line, column);
        this.id = id;
        this.type = type;
    }
    translate(environment) {
        let return_data = environment.get_variable(this.id);
        let absolute = environment.get_absolute(this.id);
        if (return_data.type != type_1.type.NULL) {
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[' + absolute + '];//Getting value of variable ' + this.id + '\n';
            return return_data.type;
        }
        else {
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        let return_data = environment.get_variable(this.id);
        if (return_data.type != type_1.type.UNDEFINED) {
            return return_data;
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no definida: ' + this.id));
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.variable_id = variable_id;

},{"../abstract/literal":6,"../system/console":45,"../system/error":47,"../system/type":48}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._symbol = exports.scope = void 0;
var scope;
(function (scope) {
    scope[scope["GLOBAL"] = 0] = "GLOBAL";
    scope[scope["LOCAL"] = 1] = "LOCAL";
})(scope = exports.scope || (exports.scope = {}));
class _symbol {
    constructor(id, data, scope, absolute, relative, size) {
        this.id = id;
        this.data = data;
        this.scope = scope;
        this.absolute = absolute;
        this.relative = relative;
        this.size = size;
    }
}
exports._symbol = _symbol;

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._3dCode = exports._console = void 0;
class console {
    constructor() {
        this.output = "";
        this.symbols = new Map();
        this.stack = new Array;
        this.heap = new Array;
        this.actualTemp = 5;
        this.actualTag = 0;
        this.breakTag = 0;
        this.continueTag = 0;
        this.absolutePos = 33; //Initial value 33 because of default functions
        this.relativePos = 0;
        this.switchEvaluation = 0;
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
        this.actualTemp = 5;
        this.actualTag = 0;
        this.breakTag = 0;
        this.continueTag = 0;
        this.absolutePos = 33;
        this.relativePos = 0;
        this.switchEvaluation = 0;
    }
}
exports._console = new console();
exports._3dCode = new console();

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const type_1 = require("./type");
const _symbol_1 = require("./_symbol");
class environment {
    constructor(previous) {
        this.previous = previous;
        this.previous = previous;
        this.symbol_map = new Map();
        this.function_map = new Map();
    }
    save_function(id, new_function, absolute, relative, size) {
        let symbol_type = _symbol_1.scope.LOCAL;
        if (this.previous == null) {
            symbol_type = _symbol_1.scope.GLOBAL;
        }
        this.function_map.set(id, new _symbol_1._symbol(id, new_function, symbol_type, absolute, relative, size));
    }
    get_function(id) {
        let symbol_item = this.function_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            let return_function = symbol_item.data;
            return return_function;
        }
        return null;
    }
    save_variable(id, data, absolute, relative, size) {
        let symbol_type = _symbol_1.scope.LOCAL;
        if (this.previous == null) {
            symbol_type = _symbol_1.scope.GLOBAL;
        }
        this.symbol_map.set(id, new _symbol_1._symbol(id, data, symbol_type, absolute, relative, size));
    }
    get_variable(id) {
        let symbol_item = this.symbol_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            let return_data = symbol_item.data;
            return return_data;
        }
        return { value: null, type: type_1.type.UNDEFINED };
    }
    get_absolute(id) {
        let symbol_item = this.symbol_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            return symbol_item.absolute;
        }
        return -1;
    }
    get_size(id) {
        let symbol_item = this.symbol_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            return symbol_item.size;
        }
        return -1;
    }
    get_relative(id) {
        let symbol_item = this.symbol_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            return symbol_item.relative;
        }
        return -1;
    }
}
exports.environment = environment;

},{"./_symbol":44,"./type":48}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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
    type[type["VOID"] = 6] = "VOID";
    type[type["UNDEFINED"] = 7] = "UNDEFINED";
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

},{}],49:[function(require,module,exports){
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
    console_1._3dCode.output = generateHeader() + generateDefaultFunctions() + console_1._3dCode.output;
    return console_1._3dCode.output;
};
function generateHeader() {
    let code = '#include <stdio.h>\n';
    code += '#include <math.h>\n';
    code += 'float HEAP[16384];\n';
    code += 'float STACK[16384];\n';
    code += 'float HP;\n';
    code += 'float SP;\n';
    code += 'float ';
    for (let i = 0; i <= console_1._3dCode.actualTemp; i++) {
        if (i == 0)
            code += 'T' + i;
        else
            code += ', T' + i;
    }
    code += ';\n';
    return code;
}
function generateDefaultFunctions() {
    let code = generateStringConcat();
    code += generateStringPrint();
    code += generateLowerCase();
    code += generateUpperCase();
    code += generateStringTimes();
    code += generateNumberPower();
    code += generateIntToString();
    code += generateOutOfBounds();
    code += generateDivisionBy0();
    code += generateStringLength();
    code += generateStringPosition();
    code += generateStringExtract();
    code += generateTypeOf();
    code += generateStringToInt();
    code += generateStringToFloat();
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
    code += 'if(T1 == -1) goto L1;\n';
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
    code += 'printf("%c", 32); // \n';
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
function generateStringLength() {
    let code = 'void StringLength(){\n';
    code += 'T0 = SP + 1;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T2 = 0;\n';
    code += 'L0:\n';
    code += 'T1 = HEAP[(int)T0];\n';
    code += 'if(T1 == 36) goto L1;\n';
    code += 'T2 = T2 + 1;\n';
    code += 'T0 = T0 + 1;\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'T0 = SP + 0;\n';
    code += 'STACK[(int)T0] = T2;\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateStringPosition() {
    let code = 'void StringPosition(){\n';
    code += 'T0 = SP + 1;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T2 = SP + 2;\n';
    code += 'T2 = STACK[(int)T2];\n';
    code += 'T3 = 0;\n';
    code += 'L0:\n';
    code += 'T1 = HEAP[(int)T0];\n';
    code += 'if(T1 == 36) goto L1;\n';
    code += 'if(T3 == T2) goto L2;\n';
    code += 'T3 = T3 + 1;\n';
    code += 'T0 = T0 + 1;\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'OutOfBounds();\n';
    code += 'T0 = SP + 0;\n';
    code += 'HEAP[(int)HP] = -1;//Set error code\n';
    code += 'STACK[(int)T0] = HP;\n';
    code += 'HP = HP + 1;\n';
    code += 'return;\n';
    code += 'L2:\n';
    code += 'T0 = SP + 0;\n';
    code += 'HEAP[(int)HP] = T1;\n';
    code += 'STACK[(int)T0] = HP;\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;\n';
    code += 'HP = HP + 1;\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateStringExtract() {
    let code = 'void StringExtract(){\n';
    code += 'T0 = SP + 1;//Get String starting position\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T5 = SP;//Save actual environment\n';
    code += 'SP = 18;//Set StringLength environment\n';
    code += 'T2 = SP + 1;\n';
    code += 'STACK[(int)T2] = T0;//Set string\n';
    code += 'StringLength();//Call StringLength\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'T0 = STACK[(int)T0];//Get return value\n';
    code += 'T0 = T0 - 1;//Max value for start or finish position\n';
    code += 'SP = T5;//Get environment back\n';
    code += 'T1 = SP + 1;//Get String starting position\n';
    code += 'T1 = STACK[(int)T1];\n';
    code += 'T2 = SP + 2;//Get start position\n';
    code += 'T2 = STACK[(int)T2];\n';
    code += 'T3 = SP + 3;//Get finish position\n';
    code += 'T3 = STACK[(int)T3];\n';
    code += 'T4 = HP;//Save new string start position\n';
    code += 'if(T2 > T0) goto L0;//Check if index is greater than length\n';
    code += 'if(T3 > T0) goto L0;//Check if index is greater than length\n';
    code += 'T2 = T1 + T2;//Update start position\n';
    code += 'T3 = T1 + T3;//Update finish position\n';
    code += 'goto L1;\n';
    code += 'L1:\n';
    code += 'T5 = HEAP[(int)T2];//Get character in heap\n';
    code += 'if(T2 > T3) goto L2;//End of extraction\n';
    code += 'HEAP[(int)HP] = T5;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase hp\n';
    code += 'T2 = T2 + 1;//Increase iterator\n';
    code += 'goto L1;//Go back to loop\n';
    code += 'L0:\n';
    code += 'OutOfBounds();\n';
    code += 'T0 = SP + 0;\n';
    code += 'HEAP[(int)HP] = -1;//Set error code\n';
    code += 'STACK[(int)T0] = HP;\n';
    code += 'HP = HP + 1;\n';
    code += 'return;\n';
    code += 'L2:\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string to new string\n';
    code += 'HP = HP + 1;//Increase HP\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T4;//Set return\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateTypeOf() {
    let code = 'void getTypeOf(){\n';
    code += 'T0 = SP + 1;//Get String starting position\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T1 = HP;\n';
    code += 'if(T0 == 0) goto L0;//Type String\n';
    code += 'if(T0 == 1) goto L1;//Type Int\n';
    code += 'if(T0 == 2) goto L2;//Type Float\n';
    code += 'if(T0 == 3) goto L3;//Type Char\n';
    code += 'if(T0 == 4) goto L4;//Type Boolean\n';
    code += 'if(T0 == 5) goto L5;//Type Struct\n';
    code += 'if(T0 == 6) goto L6;//Type Null\n';
    code += 'L0:\n';
    code += 'HEAP[(int)HP] = 83;//S\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 73;//I\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 71;//G\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L1:\n';
    code += 'HEAP[(int)HP] = 73;//I\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 69;//E\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 71;//G\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 69;//E\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L2:\n';
    code += 'HEAP[(int)HP] = 70;//F\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 79;//O\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 65;//A\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L3:\n';
    code += 'HEAP[(int)HP] = 67;//C\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 72;//H\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 65;//A\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L4:\n';
    code += 'HEAP[(int)HP] = 66;//B\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 79;//O\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 79;//O\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 69;//E\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 65;//A\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L5:\n';
    code += 'HEAP[(int)HP] = 83;//S\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 85;//U\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 67;//C\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L6:\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 85;//U\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L7:\n';
    code += 'T0 = SP + 0;//Get return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateStringToInt() {
    let code = '/*\n';
    code += 'Algorithm:\n';
    code += '    iterator = string.length\n';
    code += '    position = iterator + string.position\n';
    code += '    while(iterator >= 0){\n';
    code += '        if(character == 45){\n';
    code += '            result = result * -1\n';
    code += '            position--\n';
    code += '            iterator--\n';
    code += '            continue\n';
    code += '        }\n';
    code += '        character = string.charAt(position)\n';
    code += '        character = character - 48\n';
    code += '        result = result + mul * character\n';
    code += '        mul = mul * 10\n';
    code += '        position--\n';
    code += '        iterator--\n';
    code += '    }\n';
    code += '*/\n';
    code += 'void StringToInt(){\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T3 = SP;//Save environment\n';
    code += 'SP = 18;//Set environment for StringLength function\n';
    code += 'T1 = SP + 1;//Set string position\n';
    code += 'STACK[(int)T1] = T0;//Save string positon\n';
    code += 'StringLength();//Call function\n';
    code += 'T1 = SP + 0;//Get return position\n';
    code += 'T1 = STACK[(int)T1];//Get return value\n';
    code += 'T1 = T1 - 1;//Get last character position\n';
    code += 'SP = T3;//Get environment back\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T5 = T1;//Set iterator to string length\n';
    code += 'T1 = T1 + T0;//Set real position for last character\n';
    code += 'T2 = 1;//Set mul = 1\n';
    code += 'T3 = 0;//Set result = 0\n';
    code += 'L0://Loop tag\n';
    code += 'if(T5 < 0) goto L1;//Check if none characters are left\n';
    code += 'T0 = HEAP[(int)T1];//Get character\n';
    code += 'if(T0 == 45) goto L2;//Check if character is -\n';
    code += 'T0 = T0 - 48;//Transform character into digit\n';
    code += 'T4 = T2 * T0;//mul*digit\n';
    code += 'T3 = T3 + T4;//result = result + mul * digit\n';
    code += 'T2 = T2 * 10;//mul = mul * 10\n';
    code += 'T1 = T1 - 1;//Update character position\n';
    code += 'T5 = T5 - 1;//Update iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Transform to negative\n';
    code += 'T3 = T3 * -1;//result * -1\n';
    code += 'T1 = T1 - 1;//position--\n';
    code += 'T5 = T5 - 1;//iterator--\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1:\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T3;//Set return to result\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateStringToFloat() {
    let code = '/*\n';
    code += 'Algorithm:\n';
    code += '    iterator = string.length\n';
    code += '    position = iterator + string.position\n';
    code += '    while(iterator >= 0){\n';
    code += '        if(character == 46){\n';
    code += '            result = result / mul\n';
    code += '            mul = 1\n';
    code += '            position--\n';
    code += '            iterator--\n';
    code += '            continue\n';
    code += '        }\n';
    code += '        if(character == 45){\n';
    code += '            result = result * -1\n';
    code += '            position--\n';
    code += '            iterator--\n';
    code += '            continue\n';
    code += '        }\n';
    code += '        character = string.charAt(position)\n';
    code += '        character = character - 48\n';
    code += '        result = result + mul * character\n';
    code += '        mul = mul * 10\n';
    code += '        position--\n';
    code += '        iterator--\n';
    code += '    }\n';
    code += '*/\n';
    code += 'void StringToFloat(){\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T3 = SP;//Save environment\n';
    code += 'SP = 18;//Set environment for StringLength function\n';
    code += 'T1 = SP + 1;//Set string position\n';
    code += 'STACK[(int)T1] = T0;//Save string positon\n';
    code += 'StringLength();//Call function\n';
    code += 'T1 = SP + 0;//Get return position\n';
    code += 'T1 = STACK[(int)T1];//Get return value\n';
    code += 'T1 = T1 - 1;//Get last character position\n';
    code += 'SP = T3;//Get environment back\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T5 = T1;//Set iterator to string length\n';
    code += 'T1 = T1 + T0;//Set real position for last character\n';
    code += 'T2 = 1;//Set mul = 1\n';
    code += 'T3 = 0;//Set result = 0\n';
    code += 'T6 = 0;//Set decimal value to 0\n';
    code += 'L0://Loop tag\n';
    code += 'if(T5 < 0) goto L1;//Check if none characters are left\n';
    code += 'T0 = HEAP[(int)T1];//Get character\n';
    code += 'if(T0 == 46) goto L2;//Check if character is .\n';
    code += 'if(T0 == 45) goto L3;//Check if character is -\n';
    code += 'T0 = T0 - 48;//Transform character into digit\n';
    code += 'T4 = T2 * T0;//mul*digit\n';
    code += 'T3 = T3 + T4;//result = result + mul * digit\n';
    code += 'T2 = T2 * 10;//mul = mul * 10\n';
    code += 'T1 = T1 - 1;//Update character position\n';
    code += 'T5 = T5 - 1;//Update iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Transform result to decimal\n';
    code += 'T3 = T3 / T2;//result = result / mul\n';
    code += 'T2 = 1;//mul = 1\n';
    code += 'T1 = T1 - 1;//position--\n';
    code += 'T5 = T5 - 1;//iterator--\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L3://Transform to negative\n';
    code += 'T3 = T3 * -1;//result * -1\n';
    code += 'T1 = T1 - 1;//position--\n';
    code += 'T5 = T5 - 1;//iterator--\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1:\n';
    code += 'T3 = T3 + T6;//result = result + decimal\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T3;//Set return to result\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}

},{"./grammar/main_grammar":19,"./system/console":45,"./system/environment":46,"./system/error":47}]},{},[49]);
