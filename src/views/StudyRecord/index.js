import React, {useEffect, useState, useCallback, useMemo} from 'react';
import _ from 'lodash';
import { Table } from "../../components";
import './index.scss';
import { createTime } from "../../utils";
import { Container, Operations } from "../../bizComponents";
import { useGet, useOpenInfo } from "../../hooks";
import EditDialog from "./EditDialog";
import TotalDialog from "./TotalDialog";
import Option from "./Option";
import DeleteDialog from "./DeleteDialog";

const defaultData = [];
function StudyRecord() {
    const {data, query, loading, error} = useData();
    const [selection, setSelection] = useState([]);
    const {openInfo,setOpenInfo,close} = useOpenInfo();

    return (<div className='study-record' style={{minWidth:932}}>
        <Option data={data} selection={selection} setOpenInfo={setOpenInfo} tryFetch={tryFetch}/>
        <Container loading={loading} error={error}>
            <Table data={data} columns={useColumns(setOpenInfo)} option={useTableOption()}
                   defaultSelection={defaultData} onSelectionChange={setSelection}/>
        </Container>
        <EditDialog visible={openInfo.type === 'edit'} close={close} source={openInfo.source}/>
        <TotalDialog visible={openInfo.type === 'total'} close={close} data={data}/>
        <DeleteDialog visible={openInfo.type === 'delete'}  close={close} tryFetch={tryFetch} data={openInfo.data}/>
    </div>);

    async function tryFetch(fetch) {
        try {
            await fetch();
            query();
        } catch (e) {
            console.error('tryFetch报错：',e.message);
        }
    }
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
                {text:"编辑",onClick:()=>setOpenInfo({type:"edit",source:_.clone(o)})},
                // {text:"编辑",disabled: true},
                {text:"删除",onClick:()=>setOpenInfo({type:"delete",data:_.clone(o)})},
            ]
            return <Operations options={options}/>
        }
    },[setOpenInfo])
}

function useData() {
    const {data,doFetch,loading,error} = useGet();

    const query = useCallback(() => {
        doFetch("/study-record/query");
    }, [doFetch])

    useEffect(() => {
        query();
    }, [query]);

    return {data:data || [], query,loading,error};
}
