import React, {useEffect, useState, useCallback, useMemo} from 'react';
import _ from 'lodash';
import { Table } from "../../components";
import './index.scss';
import { api, createTime } from "../../utils";
import message from "../../components/Message/Message";
import { Operations } from "../../bizComponents";
import { useOpenInfo } from "../../hooks";
import EditDialog from "./EditDialog";
import TotalDialog from "./TotalDialog";
import Option from "./Option";

const defaultData = [];
function StudyRecord() {
    const {data, query} = useData();
    const [selection, setSelection] = useState([]);
    const {openInfo,setOpenInfo,close} = useOpenInfo();

    return (<div className='study-record' style={{minWidth:932}}>
        <Option data={data} selection={selection} query={query} setOpenInfo={setOpenInfo}/>
        <Table data={data} columns={useColumns(setOpenInfo)} option={useTableOption()}
               defaultSelection={defaultData} onSelectionChange={setSelection}/>
        <EditDialog visible={openInfo.type === 'edit'} close={close} source={openInfo.source}/>
        <TotalDialog visible={openInfo.type === 'total'} close={close} data={data}/>
    </div>);
}

export default StudyRecord;

function useTableOption(){
    return useMemo(()=>{
        return {
            fill:true,
            virtualized:true,
            fixedLeftCount:2,
            fixedRightCount:1
        }
    },[])
}

function useColumns(setOpenInfo){
    return useMemo(()=>{
        return [
            { selection: true },
            {header: "#", convert: (v, o, i) => i + 1, width: 40, align: 'center'},
            // {header: "id", bind: "_id", width: 240,},
            {
                header: "日期",
                bind: 'date',
                width: 160,
                align: "center",
                convert: v => createTime(new Date(v)).format("YYYY-MM-DD").value
            },
            {header: "时间",width:60, bind: 'time'},
            {header: "学习信息", bind: 'info.studyInfo', width: 420, convert:v=>_.join(v,'、')},
            {header: "复习信息", bind: 'info.reviewInfo', width: 480, convert:v=>_.join(v,'、')},
            {header: "操作", align:'center',width:120,convert:getOperations}
        ]

        function getOperations(v,o,i){
            const options = [
                // {text:"编辑",onClick:()=>setOpenInfo({type:"edit",source:_.clone(o)})},
                {text:"编辑",disabled: true},
                {text:"删除",onClick:()=>message.show({info:'即将开发的部分'})},
            ]
            return <Operations options={options}/>
        }
    },[])
}

function useData() {
    const [data, setData] = useState([]);

    const query = useCallback(() => {
        api.get("/study-record/query").then(res => {
            setData(res.data)
        }).catch(e => {
            console.error(e.message);
        })
    }, [])

    useEffect(() => {
        query();
    }, [query]);

    return {data, query};
}
