import React,{useState,useEffect} from 'react';
import _ from 'lodash';
import { Input, Modal } from "../../components";
import { createTime } from "../../utils";

const format = v => createTime(v).toDate().format("YYYY-MM-DD").value;

function EditDialog({ visible,close,source }) {
    const [data,setData] = useState(source);

    useEffect(()=>{
        setData(source);
    },[source])

    return <Modal visible={visible}
                  move
                  header={<h4>编辑信息</h4>}
                  confirm={handleConfirm}
                  cancel={close}>
        {/*<FormInput label='id' disabled defaultValue={_.get(data,'_id')}/>*/}
        <FormInput label='学习信息' defaultValue={_.get(data,'info.studyInfo')}/>
        <FormInput label='复习信息' defaultValue={_.get(data,'info.reviewInfo')}/>
        <FormInput label='日期' defaultValue={format(_.get(data,'date'))}/>
        <FormInput label='时间' defaultValue={_.get(data,'time')}/>
    </Modal>

    async function handleConfirm(){
        close();
    }
}

export default EditDialog;

function FormInput({label,labelWidth=80,componentWidth=180,...rest}){
    return <div style={{display:'flex',margin:6}}>
        <div style={{width:labelWidth,textAlign:'right',marginRight:4}}>{label}：</div>
        <Input style={{width:componentWidth}} {...rest}/>
    </div>
}
