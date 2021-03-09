import React,{useState,useEffect} from 'react';
import { Modal } from "../../components";

function EditDialog({ visible,close,source={} }) {
    const [data,setData] = useState(source);

    useEffect(()=>{
        setData(source)
    },[source])

    return <Modal visible={visible}
                  move
                  header='编辑数据'
                  confirm={handleConfirm}
                  cancel={close}>
        <FormInput label='id' disabled defaultValue={data._id}/>
        <FormInput label='信息' defaultValue={data.info}/>
        <FormInput label='日期' defaultValue={data.date}/>
        <FormInput label='时间' defaultValue={data.time}/>
    </Modal>

    async function handleConfirm(){
        close();
    }
}

export default EditDialog;

function FormInput({label,labelWidth=40,componentWidth=180,...rest}){
    return <div style={{display:'flex',margin:6}}>
        <div style={{width:labelWidth}}>{label}</div>
        <input style={{width:componentWidth}} {...rest}/>
    </div>
}
