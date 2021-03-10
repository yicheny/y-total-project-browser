import React, {Fragment, useRef, useState} from "react";
import {Button, Switch} from "../../components";
import message from "../../components/Message/Message";
import _ from "lodash";
import axios from "axios";
import './Option.scss';

export default function Option({data,query,selection,setOpenInfo}){
    const [isClear,setIsClear] = useState(true);
    const inputRef = useRef();

    return <div className='option'>
        <div>
            <UploadButton inputRef={inputRef}>选择文件</UploadButton>
            <Button cancel onClick={upload} className='upload'>上传</Button>
            <Switch defaultChecked={isClear} onChange={setIsClear} checkedChildren='清空' unCheckedChildren='追加'/>
        </div>
        <div>
            <Button primary onClick={download}>下载</Button>
            <Button primary onClick={add}>生成随机数据</Button>
            <Button danger onClick={deleteByIds}>删除选中数据</Button>
        </div>
        <div>
            <Button primary onClick={()=>setOpenInfo({type:'total'})}>显示统计报告</Button>
            当前共有数据：{data.length}条
        </div>
    </div>

    async function upload() {
        if(!inputRef.current.files.length) return message.show({info:"没有选择文件！",icon:"error"});
        const formData = new FormData();
        _.forEach(inputRef.current.files,(file)=>{
            formData.append('file',file,file.name);
        })
        formData.append('isClear',isClear)
        await tryFetch(()=>axios.post("/api/study-record/uploadFile",formData));
        message.show({info:"文件上传成功！",icon:"success"});
    }

    async function download() {
        const link = document.createElement('a');
        link.href = "/api/study-record/downloadFile";
        link.click();
    }

    async function add() {
        await tryFetch(() => axios.get("/api/study-record/add"));
    }

    async function deleteByIds() {
        if(!selection.length) return message.show({info:"请至少选择一条数据！",icon:"error"});
        await tryFetch(() => axios.post("/api/study-record/delete", _.map(selection, x => x['_id'])));
    }

    async function tryFetch(fetch) {
        try {
            await fetch();
            query();
        } catch (e) {
            console.error(e.message);
        }
    }
}

function UploadButton({inputRef, children}) {
    const [names, setNames] = useState([]);

    return <Fragment>
        <Button onClick={() => inputRef.current.click()}>{children}</Button>
        {_.isEmpty(names) ? "暂无数据" : names.join('，')}
        <input ref={inputRef}
               type='file'
               accept='.txt'
               multiple
               onChange={handleChange}
               style={{display: 'none'}}/>
    </Fragment>

    function handleChange() {
        const fileNames = _.map(_.get(inputRef.current, 'files', []), x => {
            return x.name;
        })
        setNames(fileNames);
    }
}