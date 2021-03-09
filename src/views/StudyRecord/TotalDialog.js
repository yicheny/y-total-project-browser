import React,{useMemo} from 'react';
import _ from 'lodash';
import {List, Modal} from "../../components";

function TotalDialog({visible,close,data}) {
    return <Modal visible={visible}
                  header='统计报告'
                  move
                  confirm={close}
                  cancel={close}>
        <List data={useListData(data)}/>
    </Modal>
}

export default TotalDialog;

function useListData(data){
    return useMemo(()=>{
        return getTimeInfo(data);

        function getTimeInfo(data){
            const times = _.map(data,x=>x.time);
            const yearInfo = getOneTimeInfo(times,'今年');
            const monthInfo = getOneTimeInfo(times.slice(-30),'本月');
            const weekInfo = getOneTimeInfo(times.slice(-7),'最近一周');
            return _.concat(yearInfo,monthInfo,weekInfo).map(x=>({text:x}))

            function getOneTimeInfo(times,prefix){
                const time_s = _.reduce(times,(acc,a)=>acc+a);
                const time_h = (time_s/60).toFixed(2);
                return [
                    `${prefix}学习共花费：`.concat(time_s, '分钟'),
                    `${prefix}学习共花费：`.concat(time_h, '小时'),
                    `${prefix}平均学习时间：`.concat((time_s/times.length).toFixed(0), '分钟'),
                    `${prefix}平均学习时间：`.concat((time_h/times.length).toFixed(2), '小时'),
                    '共计：'.concat(time_h)
                ]
            }
        }
    },[data])
}
