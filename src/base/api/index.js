import Axios from "axios";
import _ from 'lodash';
import { globalData } from "../index";

class API{
    static servers = undefined;
    static init() {
        API.servers = null;
        const settings = window.extends_settings;
        if (_.get(settings,'api_server.enable')) {
            if (_.isArray(settings.api_server.url)) {
                API.servers = _.map(settings.api_server.url, o => {
                    return Axios.create({ baseURL: o.trim() })
                })
            } else{
                API.servers = [Axios.create({ baseURL: settings.api_server.url })];
            }
        }
    }

    constructor(index) {
        this.index = index;
        this.axios = null;
        this.source = Axios.CancelToken.source();
    }

    _ensureAxios() {
        if (API.servers === undefined)
            API.init();
        if (API.servers === null || API.servers.length === 0)
            throw new Exception(Exception.SYSTEM, -2, '服务器未正确设置。');
        if (API.servers.length <= this.index)
            throw new Exception(Exception.SYSTEM, -3, '指定的服务器设置不正确。');
        if (this.index < API.servers.length)
            this.axios = API.servers[this.index];
    }

    _isStandardData(d){
        if(!_.isPlainObject(d)) return false;
        if(!d.hasOwnProperty('code') || !d.hasOwnProperty('message')) return false;
        return true;
    }

    _request(method,url,data,onUploadProgress,cancel){
        return new Promise(async (resolve,reject)=>{
            const setConfigCancelToken = (config) => {
                if (cancel === undefined || cancel === true){
                    config.cancelToken = this.source.token;
                } else if (cancel instanceof Axios.CancelToken){
                    config.cancelToken = cancel;
                }
            }

            try{
                this._ensureAxios();
                const config = { method, url, data, onUploadProgress, headers:{
                        uuid:_.get(globalData,'user.uuid'),
                        xorigin:window.location.origin
                    } }
                setConfigCancelToken(config);
                const res = (await this.axios.request(config)).data;
                if(!this._isStandardData(res)) {
                    return reject(new Exception(Exception.API,-1,'返回的数据结构不正确',url))
                }
                if(res.code === 0) {
                    return resolve(res);
                }
                if(res.code === 2007){
                    globalData.user = null;
                    sessionStorage.setItem("user-session-expired", "1");
                    window.location.reload();
                }
                return reject(new Exception(Exception.API,res.code,res.message,url));
            }catch (e){
                reject(new Exception(Exception.API,_.get(e,'request.status'),`HttpRequest Error：${e.message}`,url));
            }
        })
    }

    download(url){
        if (!_.isString(url)) throw new Error("Parameter url is not valid.");

        let href = '';
        addPrefix();
        addUuid();

        const link = document.createElement('a');
        link.href = href;
        link.click();

        function addPrefix(){
            if (url.startsWith('/')){
                href = href + url;
            }
            else{
                href = href + '/' + url;
            }
        }

        function addUuid(){
            if (href.indexOf('?') < 0){
                href = href + `?uuid=${globalData.user.uuid}`;
            }
            else{
                href = href + `&uuid=${globalData.user.uuid}`;
            }
        }
    }

    get(url,cancel){
        return this._request('get',url,undefined,undefined,cancel);
    }

    post(url,params,onUploadProgress,cancel){
        return this._request('post',url,params,onUploadProgress,cancel)
    }

    put(url, params, cancel) {
        return this._request('put', url, params, undefined, cancel);
    }

    delete(url, params, cancel) {
        return this._request('delete', url, params, undefined, cancel);
    }

    cancelTokenSourceFor() {
        return Axios.CancelToken.source();
    }
}

const api = new API(0);
export default api;

class Exception{
    static SYSTEM = "SYSTEM";
    static API = "API";

    constructor(type,code,message,url) {
        this._type = type;
        this._code = code;
        this._message = message;
        this._url = url;
    }

    get url(){
        return this._url;
    }

    get code(){
        return this._code;
    }

    get message(){
        return this._message;
    }

    get type(){
        return this._type;
    }

    get text(){
        return `[${this._code} ${this._message}`;
    }
}

