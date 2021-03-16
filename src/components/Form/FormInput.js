import React,{useContext} from "react";
import _ from 'lodash';
import {Input} from "../index";
import FormContext from "./FormContext";
import './FormInput.scss';

function FormInput({label,bind,bindConvertIn,bindConvertOut,labelWidth,componentWidth,...rest}){
    const {formValue,handleInputChange} = useContext(FormContext);

    return <div className='c-form-input'>
        <div className='c-form-input-label' style={{width:labelWidth}}>{label}</div>
        <Input style={{width:componentWidth}} onChange={handleChange} value={getValue()} {...rest}/>
    </div>

    function handleChange(v){
        return handleInputChange(bind,getOutValue())

        function getOutValue(){
            return _.isFunction(bindConvertOut) ? bindConvertOut(v) : v;
        }
    }

    function getValue(){
        const source_value = _.get(formValue,bind);
        if(_.isFunction(bindConvertIn)) return bindConvertIn(source_value);
        return source_value
    }
}
FormInput.defaultProps = {
    labelWidth:80,
    componentWidth:180
}
export default FormInput;
