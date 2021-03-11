import React from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Input.scss';

function Input({type,prefix,suffix,defaultValue,className,onChange,onBlur,onPressEnter,onFocus,placeholder}) {
    return <div className={clsx('c-input-wrap',{prefix,suffix})}>
        {prefix && <div className='c-input-prefix'>{prefix}</div>}
        <input type={type}
               defaultValue={ defaultValue }
               className={ clsx('c-input', className) }
               onChange={ eventExecute(onChange) }
               onBlur={ eventExecute(onBlur) }
               onFocus={ eventExecute(onFocus) }
               onKeyDown={ handleKeyDown }
               placeholder={ placeholder }/>
        {suffix && <div className='c-input-suffix'>{suffix}</div>}
    </div>;

    function handleKeyDown(e) {
        if (e.keyCode === 13) {//回车
            eventExecute(onPressEnter)(e);
        }
    }

    function eventExecute(cb) {
        return e => _.isFunction(cb) && cb(e.target.value);
    }
}
Input.defaultProps = {
    placeholder:'请输入……',
    type:'text'
}

export default Input;
