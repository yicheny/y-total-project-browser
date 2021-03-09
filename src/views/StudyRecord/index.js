import React, {useEffect, useState, useCallback, useRef, Fragment} from 'react';
import _ from 'lodash';
import axios from 'axios';
import {Table, Button} from "../../components";
import './index.scss';
import {createTime} from "../../utils";
import message from "../../components/Message/Message";

const columns = [
    {header: "#", convert: (v, o, i) => i + 1, width: 40, align: 'center'},
    {header: "id", bind: "_id", width: 240,},
    {
        header: "日期",
        bind: 'date',
        width: 160,
        align: "center",
        convert: v => createTime(new Date(v)).format("YYYY-MM-DD").value
    },
    {header: "时间", bind: 'time'},
    {header: "信息", bind: 'info', width: 300},
]

const defaultData = [];

function StudyRecord(props) {
    const [selection, setSelection] = useState([]);
    const {data, query} = useData();
    const inputRef = useRef();

    return (<div className='study-record'>
        <div style={{marginBottom: 8,backgroundColor:'#fff'}}>
            <UploadButton inputRef={inputRef}>选择文件</UploadButton>
            <Button primary onClick={upload}>上传</Button>
            <Button primary onClick={download}>下载</Button>
            <Button primary onClick={add}>生成随机数据</Button>
            <Button primary onClick={deleteByIds}>删除选中数据</Button>
            <Button primary onClick={remove}>全部删除</Button>
        </div>
        <Table data={data} columns={columns} defaultSelection={defaultData} onSelectionChange={setSelection}/>
    </div>);

    async function upload() {
        console.log(inputRef.current.files);

        // const file = _.head(inputRef.current.files);
        // if(!file) return message.show({info:"没有选择文件！",icon:"error"});
        // const formData = new FormData();
        // formData.append('file',file,file.name);
        // await tryFetch(()=>axios.post("/api/study-record/uploadFile",formData));
        // message.show({info:"文件上传成功！",icon:"success"});
    }

    async function download() {
        const link = document.createElement('a');
        link.href = "/api/study-record/downloadFile";
        link.click();
    }

    async function remove() {
        await tryFetch(() => axios.get("/api/study-record/deleteAll"));
    }

    async function add() {
        await tryFetch(() => axios.get("/api/study-record/add"));
    }

    async function deleteByIds() {
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

    console.log(names);
    return <Fragment>
        <Button onClick={() => inputRef.current.click()}>{children}</Button>
        {_.isEmpty(names) ? "暂无数据" : names.join(',')}
        <input ref={inputRef}
               type='file'
               accept='.txt'
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
