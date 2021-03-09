import _ from 'lodash';

class Time{
    constructor(time) {
        this._value = _.clone(time);
    }

    format(tag){
        if(!_.isDate(this._value)) return this;
        if(tag === "YYYY-MM-DD"){
            this._value = `${this._value.getFullYear()}-${add0(this._value.getMonth()+1)}-${add0(this._value.getDate())}`
        }
        return this;
    }

    toDate(){
        if(_.isNil(this._value)) return this;
        this._value = new Date(this._value);
        return this;
    }

    get value(){
        return this._value;
    }
}

function createTime(...params){
    return new Time(...params);
}

function add0(num){
    return (num < 10) ? '0'.concat(num) : num.toString();
}

export default createTime;
