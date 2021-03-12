import React from 'react';
import './Container.scss';
import { Loader } from "../../components";
import clsx from "clsx";

export default function Container({ loading, error, children }) {
    if (loading) return <div className='b-container center'><Loader fill/></div>
    if (error) return <div className='b-container center error'><ErrorTip error={ error } /></div>
    return <div className='b-container'>
        { children }
    </div>
}

function ErrorTip({ error, className }) {
    return <div className={ clsx('b-error-tip', className) }>
        <ErrorTipItem title='错误类型：'>{ error.type }</ErrorTipItem>
        <ErrorTipItem title='错误信息：'>{ error.message }</ErrorTipItem>
        <ErrorTipItem title='错误码：'>{ error.code }</ErrorTipItem>
        {error.url && <ErrorTipItem title='错误接口：'>{ error.url }</ErrorTipItem>}
    </div>
}

function ErrorTipItem({ title,children }) {
    return <div className='b-error-tip-item'>
        <div className='title'> {title} </div>
        <div>{ children }</div>
    </div>
}
