import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {Table} from "../../components";
import './index.scss';

const columns = [
    {header:"日期",bind:'date',width:200},
    {header:"时间",bind:'time'},
    {header:"信息",bind:'info',width:300},
]

function StudyRecord(props) {
    const [data,setData] = useState([]);

    useEffect(()=>{
        axios.get("http://127.0.0.1:8011/study-record/query").then(res=>{
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
