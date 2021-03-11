import React from 'react';
import './Login.scss';
import { Button, Input } from "./components";

function Login(props) {
    return (<div className='login'>
            <Card/>
        </div>);
}

export default Login;

function Card(){
    return <div className="login-card">
        <div className="login-card-body">
            <Input type='text' prefix='用户'/>
            <Input type='password' prefix='密码'/>
            <Button primary>登录</Button>
        </div>
    </div>
}
