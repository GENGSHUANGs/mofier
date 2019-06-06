'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.request = undefined;

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/***
基础接口，默认GET */
var request = exports.request = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path, options) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        options = options || {};
                        options.method = options.method || 'GET';
                        options.credentials = options.credentials || 'include';
                        options.headers = options.headers || {};
                        options.headers['Accept'] = options.headers['Accept'] || 'application/json';
                        _context.next = 7;
                        return (0, _fetch2.default)(path, options);

                    case 7:
                        return _context.abrupt('return', _context.sent);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function request(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

/**
上传文件 */
request.upload = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(path, file) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        options.body = file;
                        options.method = 'POST';
                        return _context2.abrupt('return', request(path, options));

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}();

/**
POST 接口
Usage :
post('/xxxxxxx',{name:'zhangsan',...});
*/
request.post = function (path, data, options) {
    options = options || {};
    var formdata = new FormData();
    data = data || {};
    for (var key in data) {
        formdata.append(key, data[key]);
    }

    options.body = formdata;
    options.method = 'POST';

    return request(path, options);
};

/**
Usage :
buildUrl('/xxxx?name={name}&age={age}',{
    name:'zhangsan',
    age:12
}) */
request.buildUri = function (uri) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return uri.replace(/(\{[a-zA-Z0-9_^\}]*\})/g, function (k) {
        var val = data[k.substring(1, k.length - 1)];
        return val === null || typeof val === 'undefined' ? '' : encodeURIComponent(val);
    });
};

/***
返回数据校验
Usage :
第一种用法：
let handler = (response) => {
    if(response.status !== 200){
        reject(new Error('请求失败！'));
    }
};

const response = await post('/x',{name:'zhangsan',age:12,});
if(await check(response,handler) === false){
    return ;
}
// console.log('请求成功,and the response data is : ' , await response.json());
// dosomething


第二种用法：
handler = {
    200:async (response) => {
        const data = await response.json();
        if(data[0][0].pass === false){
            reject(new Error(data[0][0].errors[0]));
            return false;
        }
        return data; // 这里已经调用了一次response.json(),后面不允许重复调用，所以需要把这里的数据返回回去，以便于下面使用
    }
};

const response = post('/x',{});
const data = await check(response,handler); // 重复调用 response.json() 会导致异常，所以这里需要hold住上面已经获取到的data，以便于接下来使用
if(data === false){
    return ;
}
console.log(data);

第三种用法：
let err = await check(response,{
    500:new Error('服务器响应错误！') , // or '服务器响应错误！'
});

if(Error.isError(err)){
    reject(err);
    return ;
}
*/
request.check = function (response, handler) {
    if (typeof handler === 'undefined' || handler === null) {
        return true;
    }

    if (Object.prototype.toString.call(handler) === '[object Function]') {
        return handler(response);
    }

    var processor = handler[response.status];
    if (typeof processor === 'undefined' || processor === null) {
        return true;
    }

    var type = Object.prototype.toString.call(processor);
    if (type === '[object Error]' || type === '[object String]') {
        return new Error(processor.message || processor);
    }

    return processor(response);
};