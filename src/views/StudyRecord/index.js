import React,{useEffect,useState,useCallback} from 'react';
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
    const [data,setData] = useState([]);
    const [selection,setSelection] = useState([]);

    const query = useCallback(()=>{
        axios.get("/api/study-record/query").then(res=>{
            setData(res.data)
        }).catch(e=>{
            console.error(e.message);
        })
    },[])

    useEffect(()=>{
        query();
    },[query])

    // console.log(data);
    return (<div className='study-record'>
            <button onClick={add}>生成数据</button>
            <button onClick={deleteByIds}>删除选中数据</button>
            <button onClick={remove}>全部删除</button>
            <Table data={data} columns={columns} defaultSelection={defaultData} onSelectionChange={setSelection}/>
        </div>);

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
