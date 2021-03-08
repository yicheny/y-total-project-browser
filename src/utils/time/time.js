class Time{
    constructor(time) {
        this.time = time;
    }

    format(){
        if("YYYY-MM-DD"){
            return `${this.time.getFullYear()}-${this.time.getMonth()+1}-${this.time.getDate()}`
        }
    }
}

function createTime(...params){
    return new Time(...params);
}

export default createTime;
