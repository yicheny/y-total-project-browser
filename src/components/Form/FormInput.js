import React,{useContext} from "react";
import _ from 'lodash';
import {Input} from "../index";
import FormContext from "./FormContext";
import './FormInput.scss';

function FormInput({label,bind,labelWidth,componentWidth,...rest}){
    const {formValue,handleInputChange} = useContext(FormContext);

    const value = _.get(formValue,bind)

    return <div className='c-form-input'>
        <div className='c-form-input-label' style={{width:labelWidth}}>{label}</div>
        <Input style={{width:componentWidth}} onChange={v=>handleInputChange(bind,v)} value={value} {...rest}/>
    </div>
}
FormInput.defaultProps = {
    labelWidth:80,
    componentWidth:180
}
export default FormInput;
