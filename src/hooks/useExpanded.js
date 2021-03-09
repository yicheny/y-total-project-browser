import {useRef,useLayoutEffect,useCallback} from 'react';

export default function useExpanded(open){
    const containerRef = useRef();
    const childRef = useRef();

    useLayoutEffect(() => {
        if(open && containerRef.current && childRef.current){
            if(isInit()) containerRef.current.style.height='auto';//初始化时必须将高度设置为`auto`，否则父级将不能响应子级的高度变化
            else containerRef.current.style.height = `${childRef.current.offsetHeight}px`;
        }else{
            if(containerRef.current){
                if(isInit()) containerRef.current.style.height = '0px';//用于解决初始化页面闪烁的问题
                else setTimeout(()=>containerRef.current.style.height = '0px',0)
            }
        }

        return ()=>{
            if (open && containerRef.current && childRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                containerRef.current.style.height = `${childRef.current.offsetHeight}px`;
            }
        }

        function isInit() {
            return containerRef.current.style.height==='';
        }
    }, [open]);

    const transitionEnd = useCallback(()=>{
        if(open) containerRef.current.style.height = 'auto';//设置为`auto`的原因是需要保证子级菜单展开时，父级菜单的高度响应变化
    },[open])

    return { containerRef, childRef, transitionEnd }
}
