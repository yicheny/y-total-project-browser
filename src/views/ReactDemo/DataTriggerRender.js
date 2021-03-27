import React,{useState,useCallback,useEffect,useRef} from 'react';
import _ from 'lodash'
import clsx from "clsx";
import './DataTriggerRender.scss';
import { Button } from "../../components";

function useGetData(){
    const [data,setData] = useState();

    const updateData = useCallback(()=>{
        setTimeout(()=>{
            setData({
                num:_.random(40,800)
            });
        },500)
    },[]);

    return [data,updateData];
}

function DataTriggerRender(props) {
    const [data,updateData] = useGetData();

    useEffect(()=>{
        updateData()
    },[updateData])

    // const key = useDepKey(data);

    return <div className='data-trigger-render'>
        <Box>
            <MockChildren data={data}/>
            <Button onClick={updateData}>更新数据</Button>
        </Box>
    </div>
}

export default DataTriggerRender;

function Box({children}){
    return <div className="c-box">
        {children}
    </div>
}

function MockChildren({data}){
    const num = _.get(data,'num');
    return <div className='mock-children'>
        当前数据：
        <MockTextTooltip>
            <div style={{width:num}}>{num}</div>
        </MockTextTooltip>
    </div>
}

function MockTextTooltip({ children, className, onClick, ...rest }){
    const containerRef = useRef({})
    const contentRef = useRef({})

    // console.log(contentRef.current.offsetWidth,containerRef.current.offsetWidth);
    useEffect(()=>{
        console.log(contentRef.current.offsetWidth,containerRef.current.offsetWidth);
    },[children])

    // const active = contentRef.current.offsetWidth > containerRef.current.offsetWidth;
    // console.log('active',active);

    return (
        <div className={clsx(className, 'text-tooltip')} ref={containerRef} {...rest}>
            <div className="tooltip" onClick={onClick} ref={contentRef}>
                {children}
            </div>
        </div>
    )
}

//
// function useDepKey(dep){
//     const [key,setKey] = useState(0);
//
//     useEffect(()=>{
//         setKey(x=>x+1);
//     },[dep])
//
//     return key;
// }

// 文档：记一次bug排查及修复过程-Tooltip异常?..
// 链接：http://note.youdao.com/noteshare?id=b16733cce6ddf870e37b8091a6c43384&sub=5A7C75B13282449A8B05E3EE8C84C102
