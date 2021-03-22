import React,{useState,Fragment} from 'react';
import _ from 'lodash';
import { Form, FormInput } from "../../components";

const ProxyNumberInput = (props)=>{
    return <FormInput suffix='%'
                      bindConvertIn={bindConvertIn}
                      bindConvertOut={bindConvertOut}
                      {...props}/>

    function bindConvertIn(v){
        return v.formValue;
    }

    function bindConvertOut(v){
        return new Percentage(v,true);
    }
}

const mockSource = ({
    num1:1.2344,
    num2:333,
    num3:0.0455,
    num4:0.4131,
    num5:16.269
})
const formOptions = [
    {component:"ProxyNumberInput",bind:'num1'},
    {component:"ProxyNumberInput",bind:'num2'},
    {component:"ProxyNumberInput",bind:'num3'},
    {component:"ProxyNumberInput",bind:'num4'},
    {component:"ProxyNumberInput",bind:'num5'}
]

// console.log(transformFormData(formOptions, mockSource));

function ProxyNumberDemo(props) {
    const [data,setData] = useState(transformFormData(formOptions,mockSource));

    console.log('data',data)
    return (<div>
        <Form value={data}
              onChange={setData}>
            {/*{ renderForm(formOptions) }*/}
            <ProxyNumberInput bind='num1'/>
            <ProxyNumberInput bind='num2'/>
            <ProxyNumberInput bind='num3'/>
            <ProxyNumberInput bind='num4'/>
            <ProxyNumberInput bind='num5'/>
        </Form>
    </div>);
}

export default ProxyNumberDemo;

function transformFormData(options,data){
    const percentageList = _.filter(options,x=>x.component === 'ProxyNumberInput');
    const percentageBindList =  _.map(percentageList,x=>x.bind);
    // const percentageFormatBindList = _.map(percentageBindList,x=>x.concat('_format'))

    return new Proxy(data,{
        "get":function(o,prop){
            const v = o[prop]
            if(notIsPercentageBind(prop) || isPercentage(v)) return v;
            return new Percentage(v);
        },
        // "set":function (o,prop,value){
        //     console.log(value,isPercentage(value),'p');
        //     if(notIsPercentageBind(prop) || isPercentage(value)){
        //         o[prop] = value;
        //     }else{
        //         o[prop] = new Percentage(value)
        //     }
        //     return true;
        // }
    })

    function notIsPercentageBind(prop){
        return !_.includes(percentageBindList,prop)
    }

    function isPercentage(v){
        return v instanceof Percentage;
    }
}

function renderForm(options){
    return <Fragment>
        {
            _.map(options,(opt,i)=>{
                const {component,...rest} = opt;
                // const Component = component;
                return <ProxyNumberInput key={i} {...rest}/>
            })
        }
        </Fragment>
}

class Percentage{
    constructor(value,isFormat) {
        if(isFormat){
            this._formatValue = value;
            this._value = parseFloat(this._formatValue/100);
        }else{
            this._value = value;
            this._formatValue = (this._value * 100).toFixed(2);
        }
    }

    get formValue(){
        return this._formatValue;
    }

    set formValue(value){
        this._formatValue = value;
        this._value = parseFloat(this._formatValue/100);
    }
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
