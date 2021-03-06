import React, {useEffect, useState, useCallback, useMemo} from 'react';
import _ from 'lodash';
import { message, Table } from "../../components";
import './index.scss';
import { format } from "../../utils";
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
            message.show({info:e.message,icon:'error'})
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
                header: "??????",
                bind: 'date',
                width: 160,
                align: "center",
                convert: format("YYYY-MM-DD")
            },
            {header: "??????",width:60, bind: 'time'},
            {header: "????????????", bind: 'info.studyInfo', width: 420, convert:v=>_.join(v,'???')},
            {header: "????????????", bind: 'info.reviewInfo', width: 480, convert:v=>_.join(v,'???')},
            {header: "??????", align:'center',width:120,convert:getOperations}
        ]

        function getOperations(v,o,i){
            const options = [
                {text:"??????",onClick:()=>setOpenInfo({type:"edit",source:_.clone(o)})},
                // {text:"??????",disabled: true},
                {text:"??????",onClick:()=>setOpenInfo({type:"delete",data:_.clone(o)})},
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
