global.YES = true;
global.NO = false;

Object.defineProperty(global, '__stack', {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {return stack;};
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  },
});
Object.defineProperty(global, '__function', {
  get: function () {
    return __stack[1].getFunctionName();
  },
});
// https://en.wikipedia.org/wiki/ANSI_escape_code
Object.defineProperty(global, '__line', {
  get: function () {
    let filepath = __stack[1].getFileName();
    let filename = filepath.split('/').pop();
    let line = __stack[1].getLineNumber();
    return `\x1b[1m\x1b[35m${filename}:${line}\x1b[0m`;
  },
});
