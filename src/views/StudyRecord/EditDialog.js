import React,{useState,useEffect} from 'react';
import {Form, FormInput, Modal} from "../../components";
// import { format } from "../../utils";

function EditDialog({ visible,close,source }) {
    const [data,setData] = useState(source);

    useEffect(()=>{
        setData(source);
    },[source])

    // console.log('data', data);
    return <Modal visible={visible}
                  move
                  header={<h4>编辑信息</h4>}
                  confirm={handleConfirm}
                  cancel={close}>
        <Form value={data} onChange={setData}>
            <FormInput label='学习信息' bind='info.studyInfo'/>
            <FormInput label='复习信息' bind='info.reviewInfo'/>
            <FormInput label='日期' bind='date'
                       // bindConvertIn={format('YYYY-MM-DD')}
                       // bindConvertOut={v=>new Date(v)}
                        />
            <FormInput label='时间' bind='time'/>
        </Form>
    </Modal>

    async function handleConfirm(){
        console.log('data', data);
        // close();
    }
}

export default EditDialog;
