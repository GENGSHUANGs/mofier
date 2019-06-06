
### mofier ###

> 连接会自动释放，无需手动处理

##### MYSQL连接支持 #####
```javascript
import {createPoolWith,connect,drain,drainAll,} from 'mofier/lib/db/v2';

// 初始化连接池
// 默认连接池
await createPoolWith(options);

// 带别名的连接池(用于多个独立连接池),默认连接池的别名为`default`
await createPoolWith(options,'pool-name');

// 从连接池中获取connection
import {using,} from 'bluebird';
await using(connect(),async connection => {
    // 使用,这里的connection用完会自动释放，不用调用 connection.release() 释放连接
});

// 从指定的别名中获取connection
await using(connect('pool-name'),async connection => {...});

// 释放连接池
await drainAll();
// 释放指定连接池
await drain('pool-name');
```


##### MYSQL查询支持 #####
```javascript
import {query,} from 'mofier/lib/db/v2';

// query 借口是经过封装后的底层借口
// 用法:
// query([_query],sql,parameters,[pool name]);

// 基本用法
const {ok,rows,fields,} = await query(_query,'select * from USER where AGE >= ? limit 0,10',[18,]); 

// 如果需要使用自定连接池
const {ok,rows,fields,} = await query(_query,'select * from USER where AGE >= ? limit 0,10',[18,],'pool-name'); 

// 其它常用接口
import {insert,update,findOne,} from 'mofier/lib/db/v2';
const id = await insert(_query,'insert into USER(NAME,AGE) values(?,?) ',['zhangsan',19,]) // 返回id 为自增长ID
const ok = await update(_query,'update USER set AGE = ? where ID = ? ',[18,id,]); 
const {affectedRows,} = ok; // affectedRows 影响行数
// 一般简写为 
// const {affectedRows,} = await update(_query,'update USER set AGE = ? where ID = ? ',[18,id,]); 

const user = await findOne(_query,'select * from USER where ID = ? ',[id,]); // 返回单个数据

// 注:
// 开发人员可基于query接口，自行扩展

```

##### MYSQL分页查询支持 #####
```javascript
import {build,} from 'mofier/lib/db/v2';
// build 接口是基于query接口的一个单表查询工具,主要用来差量更新和带条件的查询

// 差量更新
const {id,} = req.query;
const data = req.body;
const {name,age,} = data ;
await build('USER').and('ID = ? ',id).set('?NAME = ? ',name).set('?AGE = ? ',age).update(_query);
// 每一个set设置，支持`?`前缀，一旦有此前缀，参数并且为undefined(null值会被更新),则不做数据更新

// 带查询条件的分页查询
export async function listUser(filter = {},page,size,_query){
    const {keyword ,minAge,maxAge,} = filter || {};
    const keywordstr = keyword && `%${keyword}%`;
    // 构建器
    const builder = build('USER').and('?AGE >= ? ',minAge).and('?AGE < ? ',maxAge).and('?(NAME like ? or REMARK like ? )',keywordstr,keywordstr);

    // 查询总记录数量
    const count = await builder.count(_query);
    // 查询分页数据
    const datas = await builder.list((page-1)*size,size,'CREATE_TIME desc , ID desc ',_query); // 分页带排序
    // 返回分页结果
    return {page,size,count,pagecount:Math.ceil(count/size),datas,filter,};
}

router.get('/user/list/:page.json',async (req,resp,next) => {
    try{
        const {page,} = req.params;
        const {size = 50 ,} = req.query;
        const data = await listUser(req.query,parseInt(page),parseInt(size));
        resp.json(data);
    }catch(err){
        next(err);
    }
});

// 调用方法
/user/list/1.json?keyword=zhang&size=20
// 返回数据
{
    page:1,size:20,count:1,pagecount:1,datas:[{... 用户数据},],filter:{keyword:'zhang',},
}
```

##### MYSQL事务支持 #####
> 事务会自动提交或者回滚，无需手动处理
> 
```javascript
import {inTx,update,findOne,} from 'mofier/lib/db/v2';

/**
增加用户余额 
@param {number} id 用户ID 
@param {number} amount 增加的金额
@param {any} _query 外部query对象(db/v2提供的query函数，用来支持嵌套查询以及嵌套事务) */
export async function incrUserBalance(id,amount,_query){
    return await inTx(_query,async ({query:_query,}) => { // 外部 _query 被传入当前事务,如果_query为undefined，则自动获取新的连接，否则使用外部connection
        // 这里的_query使用外部出入connection(_query有值)，或者新创建的connection(_query无值)
        // 加锁
        const user = await findOne(_query,'select * from USER where ID = ? for update ',[id,]);
        // 计算新的余额
        let {balance ,} = user;
        balance = parseFloat((balance + amount).toFixed(4)); 
        // 更新余额
        await update(_query,'update USER set BALANCE = ? where ID = ? ',[balance,id,]);
        // 返回最新的用户数据
        return await findOne(_query,'select * from USER where ID = ? ',[id,]);

        // 注:事务会自动提交，如果事务代码块抛出了Error，则自动回滚
    }); 
};

// 调用
const user = await incrUserBalance(100,102.08);

// 嵌套事务
const user = await inTx(async ({query:_query,}) => { // 这里会获取到新的connection
    // do something
    return await incrUserBalance(100,102.08,_query); // 嵌套事务需要向后传递_query,使用相同的connection
});
```


##### RabbitMQ支持 #####
> 

```javascript
import {using} from 'bluebird';
import {create} from 'mofier/lib/amqp/channel';

await using(create('pool-name'),async channel => {
// .. 使用 channel
});
```

##### RabbitMQ消费 #####
```javascript
import {observe,} from 'mofier/lib/amqp/observable';
const observer = await observe('queue-name',{prefetch:10,noAck:false,});
observer.subscribe(async ({message,ack,nack}) => {
try{
    // ... do somthing
    await ack(); // 成功
}catch(err){
    console.error(err);
    await nack(); // 失败
}
},err => console.error,()=>{console.log('subscribe done')});
```

##### InfluxDB #####
```javascript
// 略
```


