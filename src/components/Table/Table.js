import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Table.scss';
import { Content, Header } from "./components";
import TableContext from "./TableContext";

function getRunTimeColumns(columns,option) {
    const {fixedLeftCount,fixedRightCount} = option;
    if(!fixedLeftCount && !fixedRightCount) return getNoLeftAndNoRightColumns();
    if(fixedLeftCount && !fixedRightCount) return getHasLeftAndNoRightColumns();
    if(!fixedLeftCount && fixedRightCount) return getNoLeftAndHasRightColumns();
    return getHasLeftAndHasRightColumns();

    function getNoLeftAndNoRightColumns(){
        return {
            fixedLeftColumns:[],
            normalColumns:setDefaultProp(columns),
            fixedRightColumns:[]
        };
    }

    function getHasLeftAndNoRightColumns(){
        return {
            fixedLeftColumns: setDefaultProp(columns.slice(0,fixedLeftCount)),
            normalColumns: setDefaultProp(columns.slice(fixedLeftCount)),
            fixedRightColumns:[]
        }
    }

    function getNoLeftAndHasRightColumns(){
        return {
            fixedLeftColumns:[],
            normalColumns: setDefaultProp(columns.slice(0,fixedRightCount)),
            fixedRightColumns: setDefaultProp(columns.slice(fixedRightCount*-1)),
        }
    }

    function getHasLeftAndHasRightColumns(){
        return {
            fixedLeftColumns:setDefaultProp(columns.slice(0,fixedLeftCount)),
            normalColumns: setDefaultProp(columns.slice(fixedLeftCount,fixedRightCount*-1)),
            fixedRightColumns: setDefaultProp(columns.slice(fixedRightCount*-1)),
        }
    }

    function setDefaultProp(columns){
        return _.map(columns,setOneDefaultProp)

        function setOneDefaultProp(col){
            if(col.selection) return setSelectionCol();
            return setNormalCol();

            function setNormalCol(){
                return _.assign({
                    width: 100,
                    convert:v=>v,
                }, col);
            }

            function setSelectionCol(){
                return _.assign({
                    width: 40,
                    align: 'center',
                },col);
            }
        }
    }
}

function getRunTimeOption(option){
    return option || {}
}

function Table({ columns, data, className, style, defaultSelection, onSelectionChange,option }) {
    const [selection,selectionAction] = useSelection(defaultSelection);
    const contentRef = useRef();
    const headerRef = useRef();
    const runtime = useRef({});

    const runtime_option = useMemo(()=>getRunTimeOption(option),[option]);
    const runtime_columns = useMemo(()=>getRunTimeColumns(columns,runtime_option),[columns,runtime_option]);

    const {clear} = selectionAction;
    useEffect(()=>{
        clear();
    },[clear,data]);//注意这里的data，删除这个依赖会有bug

    useEffect(()=>{
        if(selection) {
            _.isFunction(onSelectionChange) && onSelectionChange(selection);
        }
    },[selection,onSelectionChange]);

    const runtimeStatus = new RuntimeStatus({runtime, contentRef});
    runtimeStatus.updateXScrollOffset();

    // console.log(runtime_columns);
    // console.log('runtime',runtime.current);

    return <TableContext.Provider value={{selection,selectionAction}}>
        <div className={ clsx('c-table', className) } style={ style }>
            <Header data={ data }
                    runtime={runtime}
                    columns={ runtime_columns }
                    headerRef={headerRef}/>
            {_.isEmpty(data) ? <NoData/> : <Content data={ data }
                                                    columns={ runtime_columns }
                                                    contentRef={contentRef}
                                                    setXOffset={setXOffset}/>}
        </div>
    </TableContext.Provider>

    function setXOffset(offset) {
        if (headerRef.current){
            headerRef.current.scrollLeft = offset;
        }
    }
}

class RuntimeStatus{
    constructor({runtime, contentRef}) {
        this._runtime = runtime;
        this._contentRef = contentRef;
    }

    updateXScrollOffset(){
        if (this._contentRef.current) {
            const content = this._contentRef.current;
            if (content.scrollHeight > content.clientHeight){
                this._runtime.current.xScrollOffset = content.offsetWidth - content.clientWidth;
            } else {
                this._runtime.current.xScrollOffset = 0
            }
        }
    }
}

function NoData(){
    return <div className='c-table-nodata'>
        没有数据
    </div>
}

export default Table;

function useSelection(defaultSelection){
    const [selection,setSelection] = useState(defaultSelection);

    const clear = useCallback(()=>setSelection([]),[]);

    const has = useCallback((o)=>_.includes(selection,o),[selection])

    const selectOne = useCallback((o)=>{
        if(has(o)){
            _.pull(selection,o);
        }else{
            selection.push(o);
        }
        setSelection(_.clone(selection));
    },[has,selection])

    const isSelectAll = useCallback((data)=>{
        if(!_.get(data,'length')) return false;
        if(!_.isArray(selection)) return false;
        return selection.length === data.length;
    },[selection])

    const selectAll = useCallback((data)=>{
        if(isSelectAll(data)) {
            return setSelection([])
        }
        setSelection(_.clone(data));
    },[isSelectAll])

    return [selection,{clear,selectOne,selectAll,has,isSelectAll}]
}
