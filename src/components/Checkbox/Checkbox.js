import React, { createContext, Fragment, useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Checkbox.scss';

const CheckboxContext = createContext({});

export function Checkbox(props) {
    let {value,children,style,className,onChange,defaultChecked} = props;
    const context = useContext(CheckboxContext);
    const {values,setValues,groupChange} = context;
    const [indeterminate,setIndeterminate] = useState(props.indeterminate);
    const [checked,setChecked] = useState(_.isUndefined(defaultChecked) ? props.checked : defaultChecked);

    useEffect(()=>{
        if(values) setChecked(_.includes(values,value));
    },[value, values]);

    useEffect(()=>{
        if(!_.isNil(props.checked)) setChecked(props.checked)
    },[props.checked]);

    useEffect(()=>{
        setIndeterminate(props.indeterminate);
    },[props.indeterminate])

    const disabled = context.disabled || props.disabled;

    return <span className={clsx("c-checkbox",{indeterminate,disabled},className)} style={style} onClick={handleClick}>
        <span className={clsx('c-checkbox-box',{checked})}/>
        {children && <span className="c-checkbox-value">{children}</span>}
    </span>

    function handleClick(){
        if(disabled) return null;

        indeterminate && setIndeterminate(false);
        if(_.isEmpty(context)) {
            if(_.isBoolean(props.checked)) {
                _.isFunction(onChange) && onChange();
                return null;
            }

            const nextChecked = !checked;
            setChecked(nextChecked);
            _.isFunction(onChange) && onChange(nextChecked);
            return null;
        }

        checked ? _.pull(values, value) : values.push(value);
        const nextValues = _.clone(values);
        setValues(nextValues);
        if(groupChange) groupChange(nextValues);
    }
}
Checkbox.defaultProps={
    indeterminate:false
}

export function CheckboxGroup(props) {
    const {children,defaultValues,onChange,style,className,disabled,options} = props;
    const [values,setValues] = useState(defaultValues);

    useEffect(()=>{
        if(Array.isArray(props.values)) setValues(props.values);
    },[props.values])

    return <CheckboxContext.Provider value={{values,setValues,groupChange:onChange,disabled}}>
       <div className={clsx("c-checkbox-group",className)} style={style}>
           {options ? <RenderOptions options={options}/> : children}
       </div>
    </CheckboxContext.Provider>
}
CheckboxGroup.defaultProps={
    defaultValues:[],
    disabled:false
}

function RenderOptions({options}){
    return <Fragment>
        {
            _.map(options,(x,i)=>{
                const {label,...rest} = x || {};
                return <Checkbox key={i} {...rest}>{label}</Checkbox>
            })
        }
    </Fragment>
}
