import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {Icon} from "../index";
import './Message.scss';

function Notice(props) {
    const {info,icon,duration,onRemove} = props;

    useEffect(()=>{
        const timeId = setTimeout(onRemove,[duration-100]);//TODO 临时处理下闪烁的问题
        return ()=>clearTimeout(timeId);
    },[duration,onRemove])

    return <div className='notice' style={{animation:`${duration}ms linear 0s 1 normal none running spin`}}>
        {icon && <Icon name={icon} size={18}/>}
        {info}
    </div>
}
Notice.defaultProps={
    info:null,
    icon:null
};

class Message{
    constructor(){
        this.box = null;
        this.infoQueue = [];
        this.maxLength = 15;
    }

    removeEle = (ele)=>{
        _.pull(this.infoQueue,ele);
        ele.parentNode.removeChild(ele);
    }

    addBox = ()=>{
        if(!this.box){
            this.box = document.createElement('div');
            this.box.className = 'y-message-box';
            document.body.appendChild(this.box);
        }
    };

    addEle = (option)=>{
        if(this.infoQueue.length >= this.maxLength) return ;
        this.addBox();
        const div = document.createElement('div');
        div.className = 'y-message';
        this.box.appendChild(div);
        this.infoQueue.push(div);
        ReactDOM.render(<Notice {...option} onRemove={()=>this.removeEle(div)}/>,div);
    };

    show = (option)=>{
        if(!_.isNumber(option.duration)) option.duration = 3000;
        this.addEle(option);
    };
}

const message = new Message();
export default message;
