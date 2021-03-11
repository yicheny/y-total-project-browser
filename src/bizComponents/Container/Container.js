import React from 'react';
import './Container.scss';
import { Loader } from "../../components";

export default function Container({ loading,error,children }){
    if(loading) return <div className='b-container center'><Loader fill/></div>
    if(error) return <div className='b-container center error'><span>错误信息：{ error.message }</span></div>
    return <div className='b-container'>
        {children}
    </div>
}
