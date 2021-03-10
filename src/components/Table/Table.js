import React, { createContext,useContext,useState,useEffect,useCallback,useRef } from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Table.scss';
import { Checkbox } from "..";

const TableContext = createContext({});

function getRunTimeCol(col) {
    return _.assign({
        width: 100,
        align: 'left',
        convert: v => v,
    }, col);
}

function Table({ columns, data, className, style, defaultSelection, onSelectionChange,fixedLeft }) {
    const [selection,selectionAction] = useSelection(defaultSelection);
    const tableRef = useRef();
    const contentRef = useRef();
    const headerRef = useRef();
    const runtime = useRef({});

    const {clear} = selectionAction;
    useEffect(()=>{
        clear();
    },[clear,data]);//注意这里的data，删除这个依赖会有bug

    useEffect(()=>{
        if(selection) {
            _.isFunction(onSelectionChange) && onSelectionChange(selection);
        }
    },[selection,onSelectionChange]);

    updateState(columns, runtime, contentRef);

    return <TableContext.Provider value={{selection,selectionAction}}>
        <div className={ clsx('c-table', className) } style={ style } ref={tableRef}>
            <Header data={ data }
                    columns={ columns }
                    vScroll={runtime.current.vScroll}
                    headerRef={headerRef}/>
            {_.isEmpty(data) ? <NoData/> : <Content data={ data }
                                                    columns={ columns }
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

function updateState(columns, runtime, ref){
    if (ref.current) {
        const content = ref.current;
        if (content.scrollHeight > content.clientHeight){
            runtime.current.vScroll = content.offsetWidth - content.clientWidth;
        } else {
            runtime.current.vScroll = 0
        }
        // console.log('runtime.current.vScroll',runtime.current.vScroll);
    }
}

function NoData(){
    return <div className='c-table-nodata'>
        没有数据
    </div>
}

export default Table;

function Header({ data,columns,headerRef,vScroll }) {
    const {selectionAction} = useContext(TableContext);

    return <div className="c-table-header c-table-row">
        <div className="c-table-header-main" ref={headerRef}>
            <SelectCell onChange={()=>selectionAction.selectAll(data)} checked={selectionAction.isSelectAll(data)}/>
            {
                _.map(columns, (col, i) => {
                    const { width, align, header } = getRunTimeCol(col);
                    return <Cell key={ i } width={ width } align={ align } text={ header }/>
                })
            }
            {vScroll > 0 && <div className="scrollbar" style={{ width: vScroll,flex:'none'}} />}
        </div>
    </div>
}


function Content({ data, columns, contentRef,setXOffset }) {
    return <div className="c-table-content" ref={contentRef} onScroll={handleScroll}>
        { _.map(data, (o, i) => {
            return <Row key={ i } rowData={ o } columns={ columns } rowIndex={i}/>
        }) }
    </div>;

    function handleScroll(e){
        setXOffset(e.target.scrollLeft);
    }
}

function Row({ rowData, columns, rowIndex }) {
    const {selectionAction} = useContext(TableContext);

    return <div className="c-table-row">
        <SelectCell onChange={()=>selectionAction.selectOne(rowData)} checked={selectionAction.has(rowData)}/>
        {
            _.map(columns, (col, i) => {
                const { width, align, bind, convert } = getRunTimeCol(col);
                return <Cell key={ i } width={ width } align={ align } text={ convert(_.get(rowData,bind),rowData,rowIndex) }/>
            })
        }
    </div>
}

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

function Cell({ text, width, align,onClick }) {
    return <div className={clsx("c-table-cell",align)} style={ { width } } onClick={handleClick}>
        { text }
    </div>

    function handleClick(){
        _.isFunction(onClick) && onClick();
    }
}

function SelectCell({onChange,checked}){
    const {selection} = useContext(TableContext);
    if(!selection) return null;
    return <Cell width={ 40 } align={ 'center' } text={ <Checkbox checked={checked} onChange={onChange}/>}/>;
}
