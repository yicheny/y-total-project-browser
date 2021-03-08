class Time{
    constructor(time) {
        this._time = time;
        this._value = time;
    }

    format(tag){
        if(tag === "YYYY-MM-DD"){
            this._value = `${this._time.getFullYear()}-${add0(this._time.getMonth()+1)}-${add0(this._time.getDate())}`
        }
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
