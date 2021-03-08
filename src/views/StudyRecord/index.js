import React,{useEffect,useState,useCallback,useRef} from 'react';
import _ from 'lodash';
import axios from 'axios';
import {Table} from "../../components";
import './index.scss';
import { createTime } from "../../utils";

const columns = [
    { header:"#",convert:(v,o,i)=>i+1,width: 40, align: 'center'},
    { header:"id", bind:"_id", width:240, },
    {
        header:"日期",
        bind:'date',
        width:160,
        align:"center",
        convert:v=>createTime(new Date(v)).format("YYYY-MM-DD").value
    },
    {header:"时间",bind:'time'},
    {header:"信息",bind:'info',width:300},
]

const defaultData = [];
function StudyRecord(props) {
    const [selection,setSelection] = useState([]);
    const {data,query} = useData();
    const inputRef = useRef();

    return (<div className='study-record'>
            <input type='file' accept='.txt' ref={inputRef}/>
            <button onClick={upload}>上传</button>
            <button onClick={download}>下载</button>
            <button onClick={add}>生成随机数据</button>
            <button onClick={deleteByIds}>删除选中数据</button>
            <button onClick={remove}>全部删除</button>
            <Table data={data} columns={columns} defaultSelection={defaultData} onSelectionChange={setSelection}/>
        </div>);

    async function upload(){
        const file = _.head(inputRef.current.files);
        if(!file) return alert("没有选择文件！");
        const formData = new FormData();
        formData.append('file',file,file.name);
        await tryFetch(()=>axios.post("/api/study-record/uploadFile",formData));
        alert("文件上传成功！");
    }

    async function download(){
        const link = document.createElement('a');
        link.href = "/api/study-record/downloadFile";
        link.click();
    }

    async function remove(){
        await tryFetch(()=>axios.get("/api/study-record/deleteAll"));
    }

    async function add(){
        await tryFetch(()=>axios.get("/api/study-record/add"));
    }

    async function deleteByIds(){
        await tryFetch(()=>axios.post("/api/study-record/delete",_.map(selection,x=>x['_id'])));
    }

    async function tryFetch(fetch,){
        try{
            await fetch();
            query();
        }catch ( e ){
            console.error(e.message);
        }
    }
}

export default StudyRecord;

function useData(){
    const [data,setData] = useState([]);

    const query = useCallback(()=>{
        axios.get("/api/study-record/query").then(res=>{
            setData(res.data)
        }).catch(e=>{
            console.error(e.message);
        })
    },[])

    useEffect(()=>{
        query();
    },[query]);

    return {data,query};
}
