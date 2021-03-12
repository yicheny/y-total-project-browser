import React from 'react';
import _ from 'lodash';
import { Modal } from "../../components";
import { api } from "../../base";
import { createTime } from "../../utils";

function DeleteDialog({ visible,close,data,tryFetch }) {
    return <Modal visible={visible}
                  header={<h4>删除信息</h4>}
                  move
                  confirm={confirm}
                  cancel={close}>
        是否确认删除{createTime(new Date(_.get(data,'date'))).format("YYYY-MM-DD").value}的数据？
    </Modal>

    async function confirm(){
        await tryFetch(async ()=>{
            await api.post('/study-record/delete',[_.get(data,'_id')])
            close()
        })
    }
}

export default DeleteDialog;
