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

},{"../system/type":42,"./node":7}],5:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/error":41,"../system/type":42}],9:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/error":41,"../system/type":42}],10:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/type":42}],11:[function(require,module,exports){
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

},{"../abstract/expression":4}],12:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/type":42}],13:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/error":41,"../system/type":42}],14:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/error":41,"../system/type":42}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_unary = exports.string_unary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
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

},{"../abstract/expression":4,"../system/console":39,"../system/error":41,"../system/type":42}],16:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/error":41,"../system/type":42}],17:[function(require,module,exports){
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

},{"../abstract/expression":4,"../system/console":39,"../system/error":41,"../system/type":42}],18:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,10],$V2=[1,11],$V3=[1,12],$V4=[1,13],$V5=[1,14],$V6=[1,15],$V7=[5,8,28,29,30,31,32,33],$V8=[1,20],$V9=[2,25],$Va=[1,25],$Vb=[20,26,52],$Vc=[1,28],$Vd=[17,22],$Ve=[2,17],$Vf=[1,31],$Vg=[1,38],$Vh=[1,54],$Vi=[1,49],$Vj=[1,55],$Vk=[1,56],$Vl=[1,57],$Vm=[1,58],$Vn=[1,40],$Vo=[1,41],$Vp=[1,42],$Vq=[1,43],$Vr=[1,44],$Vs=[1,45],$Vt=[1,52],$Vu=[1,59],$Vv=[1,60],$Vw=[1,61],$Vx=[1,62],$Vy=[1,63],$Vz=[1,64],$VA=[1,69],$VB=[1,85],$VC=[1,72],$VD=[1,73],$VE=[1,74],$VF=[1,75],$VG=[1,76],$VH=[1,77],$VI=[1,78],$VJ=[1,79],$VK=[1,80],$VL=[1,81],$VM=[1,82],$VN=[1,83],$VO=[1,84],$VP=[1,86],$VQ=[1,87],$VR=[1,88],$VS=[11,12,17,22,27,52,69,74,75,76,77,78,85,86,87,88,89,90,91,92,96,97,100],$VT=[1,96],$VU=[1,97],$VV=[1,120],$VW=[1,116],$VX=[1,114],$VY=[1,115],$VZ=[1,117],$V_=[1,127],$V$=[1,128],$V01=[1,125],$V11=[1,123],$V21=[1,124],$V31=[1,122],$V41=[1,121],$V51=[11,14,22],$V61=[2,8,14,20,28,29,30,31,32,33,42,43,46,49,51,55,56,57,58,60,63,64,65,68,70,71],$V71=[11,12,17,22,27,52,69,74,75,85,86,87,88,89,90,91,92,96,97,100],$V81=[11,12,17,22,27,52,69,85,86,87,88,89,90,91,92,96,97,100],$V91=[11,12,17,22,27,52,69,87,88,91,92,96,97,100],$Va1=[11,12,17,22,27,52,69,96,97],$Vb1=[1,207],$Vc1=[11,22],$Vd1=[24,26,52],$Ve1=[1,270],$Vf1=[1,271],$Vg1=[14,68,70];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"pr_init":3,"pr_globals":4,"EOF":5,"pr_global":6,"pr_main":7,"tk_void":8,"tk_main":9,"tk_par_o":10,"tk_par_c":11,"tk_cbra_o":12,"pr_instructions":13,"tk_cbra_c":14,"pr_declaration_function":15,"pr_declaration_list":16,"tk_semicolon":17,"pr_declare_struct":18,"pr_type":19,"tk_id":20,"pr_params":21,"tk_comma":22,"pr_declaration_item":23,"tk_equal":24,"pr_expr":25,"tk_bra_o":26,"tk_bra_c":27,"tk_struct":28,"tk_integer_type":29,"tk_double_type":30,"tk_string_type":31,"tk_boolean_type":32,"tk_char_type":33,"pr_instruction":34,"pr_if":35,"pr_switch":36,"pr_while":37,"pr_do":38,"pr_for":39,"pr_assignation":40,"pr_call":41,"tk_break":42,"tk_continue":43,"tk_double_plus":44,"tk_double_minus":45,"tk_return":46,"pr_print":47,"pr_native_function":48,"tk_print":49,"pr_expression_list":50,"tk_println":51,"tk_dot":52,"tk_parse":53,"pr_native_function_option":54,"tk_to_int":55,"tk_to_double":56,"tk_string_func":57,"tk_typeof":58,"pr_access":59,"tk_for":60,"pr_forStart":61,"tk_in":62,"tk_while":63,"tk_do":64,"tk_switch":65,"pr_cases":66,"pr_case":67,"tk_case":68,"tk_colon":69,"tk_default":70,"tk_if":71,"pr_else":72,"tk_else":73,"tk_plus":74,"tk_minus":75,"tk_times":76,"tk_division":77,"tk_mod":78,"tk_power":79,"tk_sqrt":80,"tk_sin":81,"tk_cos":82,"tk_tan":83,"tk_log10":84,"tk_less_equal":85,"tk_greater_equal":86,"tk_double_equal":87,"tk_not_equal":88,"tk_greater":89,"tk_less":90,"tk_and":91,"tk_or":92,"tk_length":93,"tk_uppercase":94,"tk_lowercase":95,"tk_concat":96,"tk_repeat":97,"tk_position":98,"tk_substring":99,"tk_ternary":100,"pr_unary":101,"tk_hash":102,"tk_not":103,"pr_native":104,"tk_float":105,"tk_string":106,"tk_null":107,"tk_char":108,"tk_int":109,"tk_bool":110,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"tk_void",9:"tk_main",10:"tk_par_o",11:"tk_par_c",12:"tk_cbra_o",14:"tk_cbra_c",17:"tk_semicolon",20:"tk_id",22:"tk_comma",24:"tk_equal",26:"tk_bra_o",27:"tk_bra_c",28:"tk_struct",29:"tk_integer_type",30:"tk_double_type",31:"tk_string_type",32:"tk_boolean_type",33:"tk_char_type",42:"tk_break",43:"tk_continue",44:"tk_double_plus",45:"tk_double_minus",46:"tk_return",49:"tk_print",51:"tk_println",52:"tk_dot",53:"tk_parse",55:"tk_to_int",56:"tk_to_double",57:"tk_string_func",58:"tk_typeof",60:"tk_for",62:"tk_in",63:"tk_while",64:"tk_do",65:"tk_switch",68:"tk_case",69:"tk_colon",70:"tk_default",71:"tk_if",73:"tk_else",74:"tk_plus",75:"tk_minus",76:"tk_times",77:"tk_division",78:"tk_mod",79:"tk_power",80:"tk_sqrt",81:"tk_sin",82:"tk_cos",83:"tk_tan",84:"tk_log10",85:"tk_less_equal",86:"tk_greater_equal",87:"tk_double_equal",88:"tk_not_equal",89:"tk_greater",90:"tk_less",91:"tk_and",92:"tk_or",93:"tk_length",94:"tk_uppercase",95:"tk_lowercase",96:"tk_concat",97:"tk_repeat",98:"tk_position",99:"tk_substring",100:"tk_ternary",102:"tk_hash",103:"tk_not",105:"tk_float",106:"tk_string",107:"tk_null",108:"tk_char",109:"tk_int",110:"tk_bool"},
productions_: [0,[3,2],[4,2],[4,2],[4,1],[4,1],[7,7],[6,1],[6,2],[6,2],[15,8],[15,7],[21,4],[21,2],[16,3],[16,2],[23,3],[23,1],[23,5],[18,5],[19,1],[19,1],[19,1],[19,1],[19,1],[19,1],[13,2],[13,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,2],[34,2],[34,2],[34,2],[34,2],[34,2],[34,3],[34,3],[34,3],[34,2],[34,2],[34,1],[47,4],[47,4],[48,6],[48,4],[54,1],[54,1],[54,1],[54,1],[40,3],[40,4],[59,3],[59,4],[59,2],[59,3],[41,4],[41,3],[50,3],[50,1],[39,11],[39,7],[61,4],[61,3],[37,7],[38,9],[36,7],[66,2],[66,1],[67,4],[67,3],[35,8],[35,7],[72,4],[72,2],[25,3],[25,3],[25,3],[25,3],[25,3],[25,6],[25,4],[25,4],[25,4],[25,4],[25,4],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,5],[25,5],[25,5],[25,3],[25,3],[25,6],[25,8],[25,5],[25,1],[25,1],[25,1],[25,1],[25,2],[101,2],[101,1],[101,3],[104,1],[104,1],[104,1],[104,1],[104,1],[104,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

        return $$[$0-1]
    
break;
case 2: case 3: case 26: case 70:

        $$[$0-1].push($$[$0])
        this.$ = $$[$0-1]
    
break;
case 4: case 5: case 27: case 62: case 71:

        this.$ = [$$[$0]]
    
break;
case 6:

        this.$ = new main($$[$0-1], _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 7: case 28: case 29: case 30: case 31: case 32:
this.$ = $$[$0]
break;
case 8: case 9: case 33: case 34: case 35: case 36: case 42: case 43:
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
case 20:
this.$ = type.INTEGER
break;
case 21:
this.$ = type.FLOAT
break;
case 22:
this.$ = type.STRING
break;
case 23:
this.$ = type.BOOLEAN
break;
case 24:
this.$ = type.CHAR
break;
case 25:
this.$ = type.VOID
break;
case 37:
 
        this.$ = new _break($$[$0], _$[$0-1].first_line,_$[$0-1].first_column);
    
break;
case 38:
 
        this.$ = new _continue($$[$0], _$[$0-1].first_line,_$[$0-1].first_column);
    
break;
case 39:
 
        this.$ = new unary_instruction($$[$0-2], unary_instruction_type.INCREMENT, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 40:
 
        this.$ = new unary_instruction($$[$0-2], unary_instruction_type.DECREMENT, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 41:
 
        this.$ = new _return($$[$0-1], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 45:
 
        this.$ = new print($$[$0-1], print_type.PRINT, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 46:
 
        this.$ = new print($$[$0-1], print_type.PRINTLN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 47:
 
        this.$ = new native_parse($$[$0-5], $$[$0-1], _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 48:
 
        this.$ = new native_function($$[$0-3], $$[$0-1], _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 49: case 50: case 51: case 52:
 
        this.$ = $$[$0]
    
break;
case 53:

        this.$ = new assignation_unary($$[$0-2], $$[$0], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 59:

        this.$ = new call($$[$0-3], $$[$0-1], _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 60:

        this.$ = new call($$[$0-2], [], _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 61:

        $$[$0-2].push($$[$0])
        this.$ = $$[$0-2]
    
break;
case 67:

        this.$ = new _while($$[$0-4], $$[$0-1], _while_type.NORMAL, _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 68:

        this.$ = new _while($$[$0-2], $$[$0-6], _while_type.DO, _$[$0-8].first_line,_$[$0-8].first_column);
    
break;
case 69:

        this.$ = new _switch($$[$0-4], $$[$0-1], _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 72:

        this.$ = new _case($$[$0-2], $$[$0], _case_type.CASE, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 73:

        this.$ = new _case(null, $$[$0], _case_type.DEFAULT, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 74:

        this.$ = new _if($$[$0-5], $$[$0-2], $$[$0], _$[$0-7].first_line,_$[$0-7].first_column);
    
break;
case 75:

        this.$ = new _if($$[$0-4], $$[$0-1], null, _$[$0-6].first_line,_$[$0-6].first_column);
    
break;
case 76: case 112:

        this.$ = $$[$0-1]
    
break;
case 77: case 105: case 106: case 107: case 111:

        this.$ = $$[$0]
    
break;
case 78:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.PLUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 79:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MINUS, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 80:
 
        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.TIMES, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 81:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.DIV, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 82:

        this.$ = new arithmetic_binary($$[$0-2], $$[$0], arithmetic_binary_type.MOD, _$[$0-2].first_line,_$[$0-2].first_column);
    
break;
case 83:

        this.$ = new arithmetic_binary($$[$0-3], $$[$0-1], arithmetic_binary_type.POWER, _$[$0-5].first_line,_$[$0-5].first_column);
    
break;
case 84:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SQRT, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 85:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.SIN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 86:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.COS, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 87:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.TAN, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 88:

        this.$ = new arithmetic_unary($$[$0-1], arithmetic_unary_type.LOG10, _$[$0-3].first_line,_$[$0-3].first_column);
    
break;
case 89:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESSOREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 90:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATEROREQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 91:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.EQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 92:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.NOTEQUAL ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 93:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.GREATER ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 94:

        this.$ = new relational($$[$0-2], $$[$0],relational_type.LESS, _$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 95:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.AND ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 96:

        this.$ = new logic($$[$0-2], $$[$0],logic_type.OR ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 97:

        this.$ = new string_unary($$[$0-4],string_unary_type.LENGTH ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 98:

        this.$ = new string_unary($$[$0-4],string_unary_type.UPPERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 99:

        this.$ = new string_unary($$[$0-4],string_unary_type.LOWERCASE ,_$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 100:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.CONCAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 101:

        this.$ = new string_binary($$[$0-2], $$[$0],string_binary_type.REPEAT ,_$[$0-2].first_line, _$[$0-2].first_column);
    
break;
case 102:

        this.$ = new string_binary($$[$0-5], $$[$0-1],string_binary_type.POSITION ,_$[$0-5].first_line, _$[$0-5].first_column);
    
break;
case 103:

        this.$ = new string_ternary($$[$0-7], $$[$0-3], $$[$0-1], string_ternary_type.SUBSTRING ,_$[$0-7].first_line, _$[$0-7].first_column);
    
break;
case 104:

        this.$ = new ternary($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
    
break;
case 108:
 
        this.$ = new variable_id($$[$0], variable_id_type.NORMAL, _$[$0].first_line, _$[$0].first_column);
    
break;
case 109:
 
        this.$ = new variable_id($$[$0-1], variable_id_type.REFERENCE, _$[$0-1].first_line, _$[$0-1].first_column);
    
break;
case 110:

        this.$ = new unary($$[$0], unary_type.LOGIC ,_$[$0-1].first_line, _$[$0-1].first_column);
    
break;
case 113:

        this.$ = new native($$[$0], type.FLOAT ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 114:

        this.$ = new native($$[$0], type.STRING ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 115:

        this.$ = new native($$[$0], type.NULL ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 116:

        this.$ = new native($$[$0], type.CHAR ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 117:

        this.$ = new native($$[$0], type.INTEGER ,_$[$0].first_line, _$[$0].first_column);
    
break;
case 118:

        this.$ = new native($$[$0], type.BOOLEAN ,_$[$0].first_line, _$[$0].first_column);
    
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:$V0,15:5,16:6,18:7,19:9,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6},{1:[3]},{5:[1,16],6:17,7:18,8:$V0,15:5,16:6,18:7,19:9,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6},o($V7,[2,4]),o($V7,[2,5]),o($V7,[2,7]),{17:[1,19],22:$V8},{17:[1,21]},o([20,26],$V9,{9:[1,22]}),{20:[1,23],23:24,26:$Va},{20:[1,26]},o($Vb,[2,20]),o($Vb,[2,21]),o($Vb,[2,22]),o($Vb,[2,23]),o($Vb,[2,24]),{1:[2,1]},o($V7,[2,2]),o($V7,[2,3]),o($V7,[2,8]),{20:$Vc,23:27,26:$Va},o($V7,[2,9]),{10:[1,29]},o($Vd,$Ve,{10:[1,30],24:$Vf}),o($Vd,[2,15]),{27:[1,32]},{12:[1,33]},o($Vd,[2,14]),o($Vd,$Ve,{24:$Vf}),{11:[1,34]},{8:$Vg,11:[1,36],19:37,21:35,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6},{8:$Vg,10:$Vh,19:50,20:$Vi,25:39,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{20:[1,65]},{8:$Vg,19:37,21:66,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6},{12:[1,67]},{11:[1,68],22:$VA},{12:[1,70]},{20:[1,71]},o($Vb,$V9),o($Vd,[2,16],{52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR}),{10:[1,89]},{10:[1,90]},{10:[1,91]},{10:[1,92]},{10:[1,93]},{10:[1,94]},o($VS,[2,105]),o($VS,[2,106]),o($VS,[2,107]),o($VS,[2,108],{10:$VT,102:[1,95]}),{52:$VU},{10:[1,98]},{10:$Vh,101:99,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},o($VS,[2,111]),{8:$Vg,10:$Vh,19:50,20:$Vi,25:100,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{10:[2,49]},{10:[2,50]},{10:[2,51]},{10:[2,52]},o($VS,[2,113]),o($VS,[2,114]),o($VS,[2,115]),o($VS,[2,116]),o($VS,[2,117]),o($VS,[2,118]),{24:[1,101]},{14:[1,102],22:$VA},{2:$VV,8:$Vg,13:103,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{12:[1,129]},{8:$Vg,19:130,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6},{2:$VV,8:$Vg,13:131,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($V51,[2,13]),{8:$Vg,10:$Vh,19:50,20:$Vi,25:132,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:133,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:134,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:135,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:136,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:137,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:138,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:139,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:140,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:141,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:142,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:143,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:144,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{93:[1,145],94:[1,146],95:[1,147],98:[1,148],99:[1,149]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:150,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:151,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:152,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:153,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:154,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:155,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:156,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:157,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:158,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},o($VS,[2,109]),{8:$Vg,10:$Vh,11:[1,160],19:50,20:$Vi,25:161,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,50:159,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{53:[1,162]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:163,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},o($VS,[2,110]),{11:[1,164],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{8:$Vg,10:$Vh,19:50,20:$Vi,25:165,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{17:[2,19]},{2:$VV,8:$Vg,14:[1,166],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($V61,[2,27]),o($V61,[2,28]),o($V61,[2,29]),o($V61,[2,30]),o($V61,[2,31]),o($V61,[2,32]),{17:[1,168]},{17:[1,169]},{17:[1,170],22:$V8},{17:[1,171]},{17:[1,172]},{17:[1,173]},{10:$VT,24:[1,176],26:[1,179],44:[1,174],45:[1,175],52:[1,178],59:177},{8:$Vg,10:$Vh,19:50,20:$Vi,25:180,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{17:[1,181]},{17:[1,182]},o($V61,[2,44]),{10:[1,183]},{10:[1,184]},{10:[1,185]},{12:[1,186]},{10:[1,187],20:[1,188]},{20:$Vc,23:24,26:$Va,52:$VU},{10:[1,189]},{10:[1,190]},{2:$VV,8:$Vg,13:191,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{20:[1,192]},{2:$VV,8:$Vg,14:[1,193],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($V71,[2,78],{76:$VE,77:$VF,78:$VG}),o($V71,[2,79],{76:$VE,77:$VF,78:$VG}),o($VS,[2,80]),o($VS,[2,81]),o($VS,[2,82]),o($V81,[2,89],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG}),o($V81,[2,90],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG}),o($V91,[2,91],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,89:$VL,90:$VM}),o($V91,[2,92],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,89:$VL,90:$VM}),o($V81,[2,93],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG}),o($V81,[2,94],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG}),o([11,12,17,22,27,52,69,91,92,96,97,100],[2,95],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM}),o([11,12,17,22,27,52,69,92,96,97,100],[2,96],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN}),{10:[1,194]},{10:[1,195]},{10:[1,196]},{10:[1,197]},{10:[1,198]},o($Va1,[2,100],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,100:$VR}),o($Va1,[2,101],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,100:$VR}),{52:$VB,69:[1,199],74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{22:[1,200],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,201],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,202],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,203],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,204],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,205],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,206],22:$Vb1},o($VS,[2,60]),o($Vc1,[2,62],{52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR}),{10:[1,208]},{11:[1,209],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o($VS,[2,112]),o($Vd,[2,18],{52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR}),o($V7,[2,6]),o($V61,[2,26]),o($V61,[2,33]),o($V61,[2,34]),o($V61,[2,35]),o($V61,[2,36]),o($V61,[2,37]),o($V61,[2,38]),{17:[1,210]},{17:[1,211]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:212,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{24:[1,213],26:[1,215],52:[1,214]},{20:[1,216]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:217,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{17:[1,218],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o($V61,[2,42]),o($V61,[2,43]),{8:$Vg,10:$Vh,19:50,20:$Vi,25:219,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:220,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:221,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{2:$VV,8:$Vg,13:222,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{8:$Vg,19:224,20:[1,225],29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,61:223},{62:[1,226]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:161,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,50:227,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:161,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,50:228,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{2:$VV,8:$Vg,14:[1,229],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($V51,[2,12]),o($V7,[2,11]),{11:[1,230]},{11:[1,231]},{11:[1,232]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:233,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:234,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:235,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:236,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},o($VS,[2,84]),o($VS,[2,85]),o($VS,[2,86]),o($VS,[2,87]),o($VS,[2,88]),o($VS,[2,59]),{8:$Vg,10:$Vh,19:50,20:$Vi,25:237,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:238,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},o($VS,[2,48]),o($V61,[2,39]),o($V61,[2,40]),{17:[2,53],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{8:$Vg,10:$Vh,19:50,20:$Vi,25:239,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{20:[1,240]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:241,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},o($Vd1,[2,57]),{27:[1,242],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o($V61,[2,41]),{11:[1,243],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,244],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,245],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{2:$VV,8:$Vg,14:[1,246],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{17:[1,247]},{20:[1,248]},{24:[1,249]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:250,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{11:[1,251],22:$Vb1},{11:[1,252],22:$Vb1},o($V7,[2,10]),o($VS,[2,97]),o($VS,[2,98]),o($VS,[2,99]),{11:[1,253],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{22:[1,254],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o([11,12,17,22,27,52,69,96,97,100],[2,104],{74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO}),{11:[1,255],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o($Vc1,[2,61],{52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR}),{11:[1,256],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{17:[2,54],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o($Vd1,[2,55]),{27:[1,257],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o($Vd1,[2,58]),{12:[1,258]},{12:[1,259]},{12:[1,260]},{63:[1,261]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:262,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{24:[1,263]},{8:$Vg,10:$Vh,19:50,20:$Vi,25:264,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{12:[1,265],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{17:[2,45]},{17:[2,46]},o($VS,[2,102]),{8:$Vg,10:$Vh,19:50,20:$Vi,25:266,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},o($VS,[2,83]),o($VS,[2,47]),o($Vd1,[2,56]),{2:$VV,8:$Vg,13:267,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{66:268,67:269,68:$Ve1,70:$Vf1},{2:$VV,8:$Vg,13:272,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{10:[1,273]},{17:[1,274],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{8:$Vg,10:$Vh,19:50,20:$Vi,25:275,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{17:[2,66],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{2:$VV,8:$Vg,13:276,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{11:[1,277],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{2:$VV,8:$Vg,14:[1,278],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{14:[1,279],67:280,68:$Ve1,70:$Vf1},o($Vg1,[2,71]),{8:$Vg,10:$Vh,19:50,20:$Vi,25:281,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{69:[1,282]},{2:$VV,8:$Vg,14:[1,283],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{8:$Vg,10:$Vh,19:50,20:$Vi,25:284,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{8:$Vg,10:$Vh,19:50,20:$Vi,25:285,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,41:47,48:46,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,79:$Vn,80:$Vo,81:$Vp,82:$Vq,83:$Vr,84:$Vs,101:48,103:$Vt,104:53,105:$Vu,106:$Vv,107:$Vw,108:$Vx,109:$Vy,110:$Vz},{17:[2,65],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{2:$VV,8:$Vg,14:[1,286],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($VS,[2,103]),o($V61,[2,75],{72:287,73:[1,288]}),o($V61,[2,69]),o($Vg1,[2,70]),{52:$VB,69:[1,289],74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{2:$VV,8:$Vg,13:290,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($V61,[2,67]),{11:[1,291],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},{11:[1,292],52:$VB,74:$VC,75:$VD,76:$VE,77:$VF,78:$VG,85:$VH,86:$VI,87:$VJ,88:$VK,89:$VL,90:$VM,91:$VN,92:$VO,96:$VP,97:$VQ,100:$VR},o($V61,[2,64]),o($V61,[2,74]),{12:[1,293],35:294,71:$V41},{2:$VV,8:$Vg,13:295,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($Vg1,[2,73],{54:51,35:105,36:106,37:107,38:108,39:109,40:110,41:111,16:112,18:113,47:118,48:119,19:126,34:167,2:$VV,8:$Vg,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,42:$VX,43:$VY,46:$VZ,49:$V_,51:$V$,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41}),{17:[1,296]},{12:[1,297]},{2:$VV,8:$Vg,13:298,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($V61,[2,77]),o($Vg1,[2,72],{54:51,35:105,36:106,37:107,38:108,39:109,40:110,41:111,16:112,18:113,47:118,48:119,19:126,34:167,2:$VV,8:$Vg,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,42:$VX,43:$VY,46:$VZ,49:$V_,51:$V$,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41}),o($V61,[2,68]),{2:$VV,8:$Vg,13:299,16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:104,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{2:$VV,8:$Vg,14:[1,300],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},{2:$VV,8:$Vg,14:[1,301],16:112,18:113,19:126,20:$VW,28:$V1,29:$V2,30:$V3,31:$V4,32:$V5,33:$V6,34:167,35:105,36:106,37:107,38:108,39:109,40:110,41:111,42:$VX,43:$VY,46:$VZ,47:118,48:119,49:$V_,51:$V$,54:51,55:$Vj,56:$Vk,57:$Vl,58:$Vm,60:$V01,63:$V11,64:$V21,65:$V31,71:$V41},o($V61,[2,76]),o($V61,[2,63])],
defaultActions: {16:[2,1],55:[2,49],56:[2,50],57:[2,51],58:[2,52],102:[2,19],251:[2,45],252:[2,46]},
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

    const {native} = require('../literal/native');
    const {variable_id, variable_id_type} = require('../literal/variable_id');
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
case 5:return 98
break;
case 6:return 99
break;
case 7:return 93
break;
case 8:return 94
break;
case 9:return 95
break;
case 10:return 107
break;
case 11:return 110
break;
case 12:return 110
break;
case 13:return 79
break;
case 14:return 80
break;
case 15:return 81
break;
case 16:return 82
break;
case 17:return 83
break;
case 18:return 84
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
case 24:return 71
break;
case 25:return 73
break;
case 26:return 65
break;
case 27:return 68
break;
case 28:return 70
break;
case 29:return 42
break;
case 30:return 43
break;
case 31:return 63
break;
case 32:return 64
break;
case 33:return 60
break;
case 34:return 8
break;
case 35:return 9
break;
case 36:return 51
break;
case 37:return 49
break;
case 38:return 46
break;
case 39:return 28
break;
case 40:return 53
break;
case 41:return 55
break;
case 42:return 56
break;
case 43:return 57
break;
case 44:return 58
break;
case 45:return 42
break;
case 46:return 43
break;
case 47:return 62
break;
case 48:return 'tk_begin'
break;
case 49:return 'tk_end'
break;
case 50:return 'tk_push'
break;
case 51:return 'tk_pop'
break;
case 52:return 107
break;
case 53:return 105
break;
case 54:return 109
break;
case 55:return 106
break;
case 56:return 108
break;
case 57:return 20
break;
case 58:return 76
break;
case 59:return 77
break;
case 60:return 44
break;
case 61:return 45
break;
case 62:return 74
break;
case 63:return 75
break;
case 64:return 78
break;
case 65:return 85
break;
case 66:return 86
break;
case 67:return 90
break;
case 68:return 89
break;
case 69:return 87
break;
case 70:return 88
break;
case 71:return 92
break;
case 72:return 91
break;
case 73:return 96
break;
case 74:return 103
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
case 80:return 26
break;
case 81:return 27
break;
case 82:return 22
break;
case 83:return 97
break;
case 84:return 52
break;
case 85:return 100
break;
case 86:return 69
break;
case 87:return 17
break;
case 88:return 102
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
},{"../expression/arithmetic_binary":8,"../expression/arithmetic_unary":9,"../expression/logic":10,"../expression/parameter":11,"../expression/relational":12,"../expression/string_binary":13,"../expression/string_ternary":14,"../expression/string_unary":15,"../expression/ternary":16,"../expression/unary":17,"../instruction/_break":19,"../instruction/_case":20,"../instruction/_continue":21,"../instruction/_if":22,"../instruction/_return":23,"../instruction/_switch":24,"../instruction/_while":25,"../instruction/assignation_unary":26,"../instruction/call":27,"../instruction/declaration_function":28,"../instruction/declaration_item":29,"../instruction/declaration_list":30,"../instruction/main":31,"../instruction/native_function":32,"../instruction/native_parse":33,"../instruction/print":34,"../instruction/unary_instruction":35,"../literal/native":36,"../literal/variable_id":37,"../system/error":41,"../system/type":42,"_process":3,"fs":1,"path":2}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._break = void 0;
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class _break extends instruction_1.instruction {
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/instruction":5,"../system/type":42}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._case = exports._case_type = void 0;
const type_1 = require("../system/type");
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
        throw new Error("Method not implemented.");
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

},{"../abstract/instruction":5,"../system/type":42,"./_break":19,"./_return":23}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._continue = void 0;
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class _continue extends instruction_1.instruction {
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/instruction":5,"../system/type":42}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._if = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
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
        throw new Error("Method not implemented.");
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

},{"../abstract/instruction":5,"../system/error":41,"../system/type":42,"./_return":23}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._return = void 0;
const instruction_1 = require("../abstract/instruction");
class _return extends instruction_1.instruction {
    constructor(return_value, line, column) {
        super(line, column);
        this.return_value = return_value;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        return this.return_value.execute(environment);
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._return = _return;

},{"../abstract/instruction":5}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._switch = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const _case_1 = require("./_case");
class _switch extends instruction_1.instruction {
    constructor(switch_value, case_list, line, column) {
        super(line, column);
        this.switch_value = switch_value;
        this.case_list = case_list;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/instruction":5,"../system/error":41,"../system/type":42,"./_case":20}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._while = exports._while_type = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
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
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
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

},{"../abstract/instruction":5,"../system/error":41,"../system/type":42,"./_break":19,"./_continue":21,"./_return":23}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignation_unary = void 0;
const instruction_1 = require("../abstract/instruction");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class assignation_unary extends instruction_1.instruction {
    constructor(id, expr, line, column) {
        super(line, column);
        this.id = id;
        this.expr = expr;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id);
        if (saved_variable.type != type_1.type.NULL) {
            // validate the type
            if (saved_variable.type == expr_data.type) {
                // assign the value
                environment.save_variable(this.id, expr_data);
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

},{"../abstract/instruction":5,"../system/error":41,"../system/type":42}],27:[function(require,module,exports){
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
                        new_environment.save_variable(function_to_execute.parameters[index].id, call_parameter_data);
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

},{"../abstract/instruction":5,"../system/environment":40,"../system/error":41,"../system/type":42,"./_return":23}],28:[function(require,module,exports){
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
        environment.save_function(this.id, this);
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_function = declaration_function;

},{"../abstract/instruction":5,"../system/type":42}],29:[function(require,module,exports){
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
        throw new Error("Method not implemented.");
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

},{"../abstract/expression":4,"../abstract/instruction":5,"../abstract/literal":6,"../system/type":42}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_list = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class declaration_list extends instruction_1.instruction {
    constructor(native_type, declare_list, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.declare_list = declare_list;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    add_to_list(item) {
        this.declare_list.push(item);
    }
    execute(environment) {
        this.declare_list.forEach(item => {
            let item_data = item.execute(environment);
            // if is undefined save the variable with the type declared
            if (item_data.type == type_1.type.NULL) {
                // Save the variable 
                if (environment.get_variable(item.variable_id).type != type_1.type.NULL) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                }
                else {
                    environment.save_variable(item.variable_id, item_data);
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
                    if (environment.get_variable(item.variable_id).type != type_1.type.NULL) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                    }
                    else {
                        environment.save_variable(item.variable_id, item_data);
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

},{"../abstract/instruction":5,"../system/error":41,"../system/type":42}],31:[function(require,module,exports){
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

},{"../abstract/instruction":5,"../system/console":39,"../system/type":42}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native_function = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class native_function extends instruction_1.instruction {
    constructor(option, value, line, column) {
        super(line, column);
        this.option = option;
        this.value = value;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/instruction":5,"../system/error":41,"../system/type":42}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native_parse = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class native_parse extends instruction_1.instruction {
    constructor(native_type, value, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.value = value;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
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

},{"../abstract/instruction":5,"../system/error":41,"../system/type":42}],34:[function(require,module,exports){
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

},{"../abstract/instruction":5,"../system/console":39,"../system/type":42}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unary_instruction = exports.unary_instruction_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
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

},{"../abstract/expression":4,"../system/error":41,"../system/type":42}],36:[function(require,module,exports){
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

},{"../abstract/literal":6,"../system/console":39,"../system/type":42}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable_id = exports.variable_id_type = void 0;
const literal_1 = require("../abstract/literal");
const type_1 = require("../system/type");
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
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        let return_data = environment.get_variable(this.id);
        if (return_data.type != type_1.type.NULL) {
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

},{"../abstract/literal":6,"../system/error":41,"../system/type":42}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._symbol = exports.scope = void 0;
var scope;
(function (scope) {
    scope[scope["GLOBAL"] = 0] = "GLOBAL";
    scope[scope["LOCAL"] = 1] = "LOCAL";
})(scope = exports.scope || (exports.scope = {}));
class _symbol {
    constructor(id, data, scope) {
        this.id = id;
        this.data = data;
        this.scope = scope;
    }
}
exports._symbol = _symbol;

},{}],39:[function(require,module,exports){
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
    }
}
exports._console = new console();
exports._3dCode = new console();

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const declaration_function_1 = require("../instruction/declaration_function");
const type_1 = require("./type");
const _symbol_1 = require("./_symbol");
class environment {
    constructor(previous) {
        this.previous = previous;
        this.previous = previous;
        this.symbol_map = new Map();
        this.function_map = new Map();
    }
    save_function(id, new_function) {
        let symbol_type = _symbol_1.scope.LOCAL;
        if (this.previous == null) {
            symbol_type = _symbol_1.scope.GLOBAL;
        }
        this.function_map.set(id, new _symbol_1._symbol(id, new_function, symbol_type));
    }
    get_function(id) {
        let symbol_item = this.function_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            let return_function = symbol_item.data;
            if (return_function instanceof declaration_function_1.declaration_function) {
                return return_function;
            }
        }
        return null;
    }
    save_variable(id, data) {
        let symbol_type = _symbol_1.scope.LOCAL;
        if (this.previous == null) {
            symbol_type = _symbol_1.scope.GLOBAL;
        }
        this.symbol_map.set(id, new _symbol_1._symbol(id, data, symbol_type));
    }
    get_variable(id) {
        let symbol_item = this.symbol_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            let return_data = symbol_item.data;
            if (!(return_data instanceof declaration_function_1.declaration_function)) {
                return return_data;
            }
        }
        return { value: null, type: type_1.type.NULL };
    }
}
exports.environment = environment;

},{"../instruction/declaration_function":28,"./_symbol":38,"./type":42}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{"./grammar/main_grammar":18,"./system/console":39,"./system/environment":40,"./system/error":41}]},{},[43]);
