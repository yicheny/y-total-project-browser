import React from 'react';
import _ from "lodash";
import './Operations.scss';
import clsx from "clsx";

function Operations({options}){
    return <div className='b-operations'>
        {_.map(options,(x,i)=>{
            return <span key={i}
                         className={clsx('b-operations-item',{disabled:x.disabled})}
                         onClick={x.onClick}>{ x.text }</span>
        })}
    </div>
}

export default Operations;
