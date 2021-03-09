import React, {useEffect, useState, useCallback, useRef, useMemo,Fragment} from 'react';
import _ from 'lodash';
import axios from 'axios';
import { Table, Button, Switch } from "../../components";
import './index.scss';
import {createTime} from "../../utils";
import message from "../../components/Message/Message";
import { Operations } from "../../bizComponents";
import { useOpenInfo } from "../../hooks";
import EditDialog from "./EditDialog";

const defaultData = [];

function StudyRecord(props) {
    const {data, query} = useData();
    const [selection, setSelection] = useState([]);
    const {openInfo,setOpenInfo,close} = useOpenInfo();
    const [isClear,setIsClear] = useState(true);
    const inputRef = useRef();

    return (<div className='study-record' style={{minWidth:932}}>
        <div style={{marginBottom: 8,padding:"4px 0",backgroundColor:'#fff'}}>
            <UploadButton inputRef={inputRef}>选择文件</UploadButton>
            <Button primary onClick={upload}>上传</Button>
            <Switch defaultChecked={isClear} onChange={setIsClear} checkedChildren='清空' unCheckedChildren='追加'/>
            <Button primary onClick={download}>下载</Button>
            <Button primary onClick={add}>生成随机数据</Button>
            <Button primary onClick={deleteByIds}>删除选中数据</Button>
            <div>当前共有数据：{data.length}条</div>
        </div>
        <Table data={data} columns={useColumns(setOpenInfo)} defaultSelection={defaultData} onSelectionChange={setSelection}/>
        <EditDialog visible={openInfo.type === 'edit'} close={close} source={openInfo.source}/>
    </div>);

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

    async function tryFetch(fetch,) {
        try {
            await fetch();
            query();
        } catch (e) {
            console.error(e.message);
        }
    }
}

export default StudyRecord;

function useColumns(setOpenInfo){
    return useMemo(()=>{
        return [
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
            {header: "学习信息", bind: 'info.studyInfo', width: 320, convert:v=>_.join(v,'、')},
            {header: "复习信息", bind: 'info.reviewInfo', width: 80, convert:v=>_.join(v,'、')},
            {header: "操作", align:'center',width:120,convert:getOperations}
        ]

        function getOperations(v,o,i){
            const options = [
                // {text:"编辑",onClick:()=>setOpenInfo({type:"edit",source:_.clone(o)})},
                {text:"编辑",onClick:()=>message.show({info:'暂时用不到的功能'})},
                {text:"删除",onClick:()=>message.show({info:'暂时用不到的功能'})},
            ]
            return <Operations options={options}/>
        }
    },[])
}

function useData() {
    const [data, setData] = useState([]);

    const query = useCallback(() => {
        axios.get("/api/study-record/query").then(res => {
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
