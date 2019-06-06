import fetch from './fetch';

/***
基础接口，默认GET */
export const request = async ( path, options ) => {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = options.credentials || 'include' ;
    options.headers = options.headers || {};
    options.headers[ 'Accept' ] = options.headers[ 'Accept' ] || 'application/json';
    return await fetch(path, options );
};

/**
上传文件 */
request.upload = async ( path, file, options = {} ) => {
    options.body = file;
    options.method = 'POST';
    return request(path, options );
};

/**
POST 接口
Usage :
post('/xxxxxxx',{name:'zhangsan',...});
*/
request.post = function ( path, data, options ) {
    options = options || {};
    const formdata = new FormData();
    data = data || {};
    for (let key in data) {
        formdata.append(key, data[ key ] );
    }

    options.body = formdata;
    options.method = 'POST';

    return request(path, options )
};

/**
Usage :
buildUrl('/xxxx?name={name}&age={age}',{
    name:'zhangsan',
    age:12
}) */
request.buildUri = function ( uri, data = {} ) {
    return uri.replace(/(\{[a-zA-Z0-9_^\}]*\})/g, k => {
        let val = data[ k.substring(1, k.length - 1 ) ];
        return val === null || typeof val === 'undefined' ? '' : encodeURIComponent(val );
    } );
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
request.check = function ( response, handler ) {
    if ( typeof handler === 'undefined' || handler === null ) {
        return true;
    }

    if ( Object.prototype.toString.call(handler ) === '[object Function]' ) {
        return handler(response );
    }

    const processor = handler[ response.status ];
    if ( typeof processor === 'undefined' || processor === null ) {
        return true;
    }

    const type = Object.prototype.toString.call(processor );
    if ( type === '[object Error]' || type === '[object String]' ) {
        return new Error(processor.message || processor );
    }

    return processor(response );
};
