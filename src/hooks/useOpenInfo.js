import { useCallback, useState } from "react";

export default function useOpenInfo(defaultValue={}){
    const [openInfo,setOpenInfo] = useState(defaultValue);
    const close =  useCallback(()=>{
        setOpenInfo({});
    },[]);
    return {openInfo,setOpenInfo,close};
}
