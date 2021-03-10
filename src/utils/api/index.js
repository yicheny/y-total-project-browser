import axios from "axios";

class API{
    constructor() {
        this._axios = axios;
    }

    get(url){
        return new Promise(async (resolve,reject)=>{
            try{
                const res = await this._axios.get(url);
                resolve(res.data);
            }catch (e){
                const error = {
                    _code:e.request.status,
                    _message:e.message
                }
                reject(error);
            }
        })
    }

}

const api = new API();
export default api;
