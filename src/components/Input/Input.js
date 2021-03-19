import React,{useState} from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Input.scss';

//keyCode === 13 回车
function Input({value,type,prefix,suffix,defaultValue,className,placeholder,onChange}) {
    const [stateValue,setStateValue] = useState(_.isUndefined(defaultValue) ? '' : _.toString(defaultValue));

    const _value = getValue();

    return <div className={clsx('c-input-wrap',{prefix,suffix})}>
        {prefix && <div className='c-input-prefix'>{prefix}</div>}
        <input type={type}
               value={ _value }
               className={ clsx('c-input', className) }
               onChange={ handleChange}
               placeholder={ placeholder }/>
        {suffix && <div className='c-input-suffix'>{suffix}</div>}
    </div>;

    function handleChange(e){
        const nextValue = e.target.value;
        if (nextValue !== _value) {
            setStateValue(nextValue);
            if (_.isFunction(onChange)) onChange(nextValue);
        }
    }

    function getValue(){
        const r = _.isUndefined(value) ? stateValue : value
        if(_.isNaN(r)) return '';
        return r;
    }
}
Input.defaultProps = {
    placeholder:'请输入……',
    type:'text'
}

export default Input;
