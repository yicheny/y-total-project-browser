import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {Table} from "../../components";
import './index.scss';
import { createTime } from "../../utils";

const columns = [
    {header:"日期",bind:'date',width:160,convert:v=>createTime(new Date(v)).format("YYYY-MM-DD").value},
    {header:"时间",bind:'time'},
    {header:"信息",bind:'info',width:300},
]

function StudyRecord(props) {
    const [data,setData] = useState([]);

    useEffect(()=>{
        axios.get("/api/study-record/query").then(res=>{
            setData(res.data);
        }).catch(e=>{
            console.error(e.message);
        })
    },[])

    // console.log(data);
    return (<div className='study-record'>
           <Table data={data} columns={columns}/>
        </div>);
}

export default StudyRecord;
