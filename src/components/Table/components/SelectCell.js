import React,{useContext} from 'react';
import { Cell } from "./index";
import { Checkbox } from "../..";
import TableContext from "../TableContext";

export default function SelectCell({onChange,checked,...rest}){
    const {selection} = useContext(TableContext);
    if(!selection) return null;
    return <Cell text={ <Checkbox checked={checked} onChange={onChange}/>} {...rest}/>;
}
