import React from 'react';
import _ from "lodash";
import './Operations.scss';

function Operations({options}){
    return <div className='b-operations'>
        {_.map(options,(x,i)=>{
            return <span key={i} className='b-operations-item' onClick={x.onClick}>{ x.text }</span>
        })}
    </div>
}

export default Operations;
