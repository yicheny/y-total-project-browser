import React, { useState } from 'react';
import './Login.scss';
import {Button, Input, message} from "./components";
import { api, globalData } from "./base";

function Login({history}) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    return (<div className='login'>
        <div className="login-card">
            <div className="login-card-body">
                <Input type='text' prefix='用户' onChange={setUserName}/>
                <Input type='password' prefix='密码' onChange={setPassword}/>
                <Button primary onClick={handleLogin}>登录</Button>
                <div className='login-error'>
                    {error &&  <div className="login-error-inner">{error}</div>}
                </div>
            </div>
        </div>
    </div>);

    async function handleLogin(){
        // console.log(userName, password);
        setError(null)
        setLoading(true);
        try{
            await loginRequest(userName,password);
            setLoading(false);
            message.show({info:'登录成功！',icon:'success'})
            history.push("/study-record")
        }catch ( e ){
            console.log('登录报错：',e);
            setError(e.message);
            setLoading(false);
        }
    }
}

export default Login;

function loginRequest(name, pwd, encrypted = false) {
    let data = new FormData();
    data.append('name', name);
    data.append('password', pwd);
    data.append('encrypted', encrypted);

    return api.post('/user/login', data).then(res => {
        globalData.user = res.data;
    });
}
