import React,{useState} from 'react';
import _ from "lodash";
import { Form, FormInput } from "../../components";

const ProxyNumberInput = (props)=>{
    return <FormInput suffix='%'
                      bindConvertIn={bindConvertIn}
                      bindConvertOut={bindConvertOut} {...props}/>
}

const mockData = ({
    num1:1.2344,
    num2:333,
    num3:0.0455,
    num4:0.4131,
    num5:16.269
})
function ProxyNumberDemo(props) {
    const [data,setData] = useState(initData(mockData));

    return (<div>
        <Form value={data} onChange={setData}>
            <ProxyNumberInput bind='num1'/>
            <ProxyNumberInput bind='num2'/>
            <ProxyNumberInput bind='num3'/>
            <ProxyNumberInput bind='num4'/>
            <ProxyNumberInput bind='num5'/>
        </Form>
    </div>);
}

export default ProxyNumberDemo;

//
function bindConvertIn(value){
    console.log('bindConvertIn',value,value instanceof ProxyNumber,value.getFormatValue());
    if(value instanceof ProxyNumber) return value.getFormatValue();
    // return value * 100;
}

function bindConvertOut(value){
    console.log('bindConvertOut',value)
    if(value instanceof ProxyNumber) return value;
    return new ConvertOutProxyNumber(value);
}

class ProxyNumber{
    get realValue(){
        return this._realValue;
    }

    getFormatValue(){
        let formatValue = this._realValue * 100;
        if(!this._hasSuffix) return formatValue;
        if(!_.includes('.')) return (formatValue + '.');
        return formatValue;
    }
}

class InitProxyNumber extends ProxyNumber{
    constructor(originalValue) {
        // console.log('InitProxyNumber-originalValue', originalValue);
        super();
        this._realValue = originalValue;
        this._hasSuffix = false;
    }
}

class ConvertOutProxyNumber extends ProxyNumber{
    constructor(originalValue) {
        // console.log('ConvertOutProxyNumber-originalValue',originalValue);
        super();
        this._realValue = (originalValue/100).toFixed(4);
        this._hasSuffix = false;
    }
}

function initData(data){
    _.forEach(data,(value,key)=>{
        data[key] = new InitProxyNumber(value);
    });
    // console.log('initData',JSON.stringify(data));
    return data;
}

/*function operationCore(a, b, op){
    let o1 = toInteger(a);
    let o2 = toInteger(b);
    let n1 = o1.num;
    let n2 = o2.num;
    let t1 = o1.times;
    let t2 = o2.times;
    let max = t1 > t2 ? t1 : t2;
    let result = null;
    if(op === 'add'){
        if (t1 === t2) { // 两个小数位数相同
            result = n1 + n2
        } else if (t1 > t2) { // o1 小数位 大于 o2
            result = n1 + n2 * (t1 / t2)
        } else { // o1 小数位 小于 o2
            result = n1 * (t2 / t1) + n2
        }
        return result / max;
    }

    if(op === 'subtract'){
        if (t1 === t2) {
            result = n1 - n2
        } else if (t1 > t2) {
            result = n1 - n2 * (t1 / t2)
        } else {
            result = n1 * (t2 / t1) - n2
        }
        return result / max;
    }

    if(op === 'multiply') {
        result = (n1 * n2) / (t1 * t2);
        return result;
    }

    if(op === 'divide'){
        result = (n1 / n2) * (t2 / t1);
        return result;
    }

    function toInteger(floatNum){
        let ret = {times: 1, num: 0};
        if (isInteger(floatNum)) {
            ret.num = floatNum;
            return ret
        }
        //1.//转字符串
        let strfi = floatNum + '';
        //2.//拿到小数点为
        let dotPos = strfi.indexOf('.');
        //3. //截取需要的长度
        let len = strfi.substr(dotPos + 1).length;
        //4.倍数就是长度的幂
        let times = Math.pow(10, len);
        let intNum = parseInt(floatNum * times , 10);
        ret.times = times;
        ret.num = intNum;
        return ret

        function isInteger(obj){
            return Math.floor(obj) === obj //向下取整就是为了让整数部分截取下来不变
        }
    }
}*/
