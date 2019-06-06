import { DEFAULT, update, findOne, query, } from './index.js';

/**
判断参数是否为空

规则如下
undefined   : true
null        : false,
''          : false,
[]          : true,
[undefined,]: true
[null,]     : false
['',]       : false */
function empty( val, isdeep = false ) {
    if ( typeof val === 'undefined' ) {
        return true;
    }

    if ( val === null ) {
        return false;
    }

    if ( Object.prototype.toString.call(val ) === '[object String]' ) {
        return false;
    }

    if ( Object.prototype.toString.call(val ) === '[object Boolean]' ) {
        return !val;
    }

    if ( Array.isArray(val ) ) {
        if ( val.length === 0 ) {
            return true;
        }

        if ( isdeep === true ) {
            return false;
        }

        // 如果数组中有一个数据有值，则直接可用
        for (let i = 0; i < val.length; i++) {
            const isempty = empty(val[ i ], true );
            if ( !isempty ) {
                return false;
            }
        }

        return true;
    }
    return false;
}
;

// console.log('--------->:新测试alishop账号:2982', empty([] ) );

/**
判断条件是否处理空的情况
field前面如果加的有 ? ，则需要处理空的情况；如果数据为空，则返回false，否则返回处理过的field和value */
function testif( field, values, tester ) {
    // 不需要处理，传递什么值就是什么值
    if ( field.indexOf('?' ) !== 0 ) {
        return { field, values, };
    }

    field = field.substring(1 );
    if ( tester === true ) {
        return { field, values, };
    } else if ( tester === false ) {
        return false;
    }

    const isempty = empty(values );
    if ( isempty ) {
        return false;
    }

    return { field, values, };
}
;

export function build( table, _query, pname = DEFAULT, options ) {
    if ( typeof _query !== 'undefined' && _query !== null && Object.prototype.toString.call(_query ) === '[object String]' ) {
        options = pname;
        pname = typeof _query === 'undefined' ? DEFAULT : _query;
        _query = undefined;
    }
    return new Builder(table, _query, pname, options );
}
;

/**
构建器 */
export default class Builder {
    constructor( table, _query, pname = DEFAULT, {priority = 1, transferOname = true, } = {} ) {
        this.table = table;
        this.updateFields = [];
        this.conditionFields = [];
        this._query = _query;
        this.pname = pname;
        this.options = { priority, transferOname, };
    }

    /**
    设置表 */
    table( table ) {
        this.table = table;
        return this;
    }

    /**
    追加条件 */
    append( builder ) {
        if ( !builder ) {
            return this;
        }

        this.conditionFields = this.conditionFields.concat(builder.conditionFields );
        return this;
    }

    /**
    添加条件判断 */
    cond( op, field, values ) {
        const r = testif(field, values );
        if ( r === false ) {
            return this;
        }

        this.conditionFields.push({ field: `${op} ${r.field}`, values: r.values, } );
        return this;
    }

    /**
    and 判断 */
    and( field, ...values ) {
        return this.cond('and', field, values );
    }

    /**
    or 判断 */
    or( field, ...values ) {
        return this.cond('or', field, values );
    }

    /**
    设置更新的字段 */
    set( field, ...values ) {
        const r = testif(field, values );
        if ( r === false ) {
            return this;
        }

        this.updateFields.push(r );
        return this;
    }

    _build_update_fields_sql() {
        const sqls = [];
        let parameters = [];
        this.updateFields.forEach(( {field, values, } ) => {
            sqls.push(field );
            parameters = parameters.concat(values || [] );
        } );
        let sql = sqls.join(',' );
        if ( sqls.length > 0 ) {
            sql = `set ${sql} `;
        }
        return { sql, parameters, };
    }

    _build_condition_fields_sql() {
        const sqls = [];
        let parameters = [];
        this.conditionFields.forEach(( {field, values, } ) => {
            sqls.push(field );
            parameters = parameters.concat(values || [] );
        } );
        return { sql: sqls.join(' ' ), parameters, };
    }

    /**
    执行更新操作 */
    async update( _query, _check, name, options ) {
        if ( _check !== 'nocheck' && this.conditionFields.length === 0 ) {
            throw new Error('invalid update operation , condition must not empty !' );
        }

        const updateFieldsSQL = this._build_update_fields_sql();
        const conditionFieldsSQL = this._build_condition_fields_sql();

        return await update(_query || this._query, `update ${this.table} ${updateFieldsSQL.sql} where 1 = 1 ${conditionFieldsSQL.sql} `, [ ...(updateFieldsSQL.parameters), ...(conditionFieldsSQL.parameters), ], name || this.pname, options || this.options );
    }

    /**
    查询 */
    async select( sql, orderBy, skip, limit, _query, name, options ) {
        if ( Object.prototype.toString.call(limit ) !== '[object Number]' ) {
            _query = limit;
            limit = undefined;
        }
        if ( Object.prototype.toString.call(skip ) !== '[object Number]' ) {
            _query = skip;
            skip = undefined;
        }
        if ( Object.prototype.toString.call(orderBy ) !== '[object String]' ) {
            _query = orderBy;
            orderBy = undefined;
        }
        if ( Object.prototype.toString.call(sql ) !== '[object String]' ) {
            _query = sql;
            sql = undefined;
        }
        const conditionFieldsSQL = this._build_condition_fields_sql();
        return await query(_query || this._query, `select ${sql || '*'} from ${this.table} where 1 = 1 ${conditionFieldsSQL.sql} ${orderBy ? `order by ${orderBy} ` : ''} ${typeof skip !== 'undefined' && skip !== null ? `limit ${skip},${limit}` : ''}`.replace(/\{\$table\}/g, this.table ), conditionFieldsSQL.parameters, name || this.pname, options || this.options );
    }

    /**
    查询单个数据 */
    async one( sql, _query, name, options ) {
        if ( Object.prototype.toString.call(sql ) !== '[object String]' ) {
            _query = sql;
            sql = undefined;
        }
        const conditionFieldsSQL = this._build_condition_fields_sql();
        return await findOne(_query || this._query, `${sql || `select * from ${this.table} `} where 1 = 1 ${conditionFieldsSQL.sql}`.replace(/\{\$table\}/g, this.table ), conditionFieldsSQL.parameters, name || this.pname, options || this.options );
    }

    /**
    查询数量 */
    async count( sql, _query, name, options ) {
        if ( Object.prototype.toString.call(sql ) !== '[object String]' ) {
            _query = sql;
            sql = undefined;
        }
        const {count, } = await this.one(sql || `select count(*) as count from ${this.table} `, _query, name || this.pname, options || this.options );
        return parseInt(count);
    }

    /**
    删除 */
    async delete( _query, _check ) {
        if ( _check !== 'nocheck' && this.conditionFields.length === 0 ) {
            throw new Error('invalid delete operation , condition must not empty !' );
        }

        const conditionFieldsSQL = this._build_condition_fields_sql();
        return await update(_query || this._query, `delete from ${this.table} where 1 = 1 ${conditionFieldsSQL.sql} `, conditionFieldsSQL.parameters );
    }

    /**
    查询所有数据 */
    async all( orderBy, _query, name, options ) {
        if ( Object.prototype.toString.call(orderBy ) !== '[object String]' ) {
            _query = orderBy;
            orderBy = undefined;
        }
        return await this.list(undefined, undefined, orderBy, _query, name, options );
    }

    /**
    分页查询 */
    async list( skip, limit, orderBy, _query, name, options ) {
        if ( Object.prototype.toString.call(orderBy ) !== '[object String]' && !_query ) {
            _query = orderBy;
            orderBy = undefined;
        }
        const withSkip = typeof skip !== 'undefined' && skip !== null;
        const conditionFieldsSQL = this._build_condition_fields_sql();
        const {rows, } = await query(_query || this._query, `
                select * from ${this.table}
                where 1 = 1 ${conditionFieldsSQL.sql}
                ${orderBy ? `order by ${orderBy}` : ''}
                ${withSkip ? 'limit ?,? ' : '' }`, [ ...(conditionFieldsSQL.parameters), ...(withSkip ? [ skip, limit ] : []), ], name || this.pname, options || this.options );
        return rows;
    }
}
;
