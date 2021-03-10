import React, { createContext,useContext,useState,useEffect,useCallback,useRef,useMemo } from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Table.scss';
import { Checkbox } from "..";

const TableContext = createContext({});

function getRunTimeColumns(columns) {
    return _.map(columns,setDefaultProp);

    function setDefaultProp(col){
        if(col.selection) return setSelectionCol();
        return setNormalCol();

        function setNormalCol(){
            return _.assign({
                width: 100,
                convert:v=>v
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

function Table({ columns, data, className, style, defaultSelection, onSelectionChange,fixedLeft }) {
    const [selection,selectionAction] = useSelection(defaultSelection);
    const tableRef = useRef();
    const contentRef = useRef();
    const headerRef = useRef();
    const runtime = useRef({});

    const runtime_columns = useMemo(()=>getRunTimeColumns(columns),[columns]);

    const {clear} = selectionAction;
    useEffect(()=>{
        clear();
    },[clear,data]);//注意这里的data，删除这个依赖会有bug

    useEffect(()=>{
        if(selection) {
            _.isFunction(onSelectionChange) && onSelectionChange(selection);
        }
    },[selection,onSelectionChange]);

    const runtimeStatus = new RuntimeStatus({columns:runtime_columns, runtime, contentRef});
    runtimeStatus.updateVScroll();
    runtimeStatus.updateFixedLeft(fixedLeft);

    console.log(runtime.current);

    return <TableContext.Provider value={{selection,selectionAction}}>
        <div className={ clsx('c-table', className) } style={ style } ref={tableRef}>
            <Header data={ data }
                    columns={ runtime_columns }
                    vScroll={runtime.current.vScroll}
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
    constructor({columns, runtime, contentRef}) {
        this._columns = columns;
        this._runtime = runtime;
        this._contentRef = contentRef;
    }

    updateVScroll(){
        if (this._contentRef.current) {
            const content = this._contentRef.current;
            if (content.scrollHeight > content.clientHeight){
                this._runtime.current.vScroll = content.offsetWidth - content.clientWidth;
            } else {
                this._runtime.current.vScroll = 0
            }
        }
    }

    updateFixedLeft(fixedLeftCount){
        const fixedLeftCols = this._columns.slice(0,fixedLeftCount);
        this._runtime.current.fixedLeft = _.reduce(fixedLeftCols,(acc,x)=>acc+x.width,0);
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
            {
                _.map(columns, (col, i) => {
                    const { width, align, header } = col;
                    if(col.selection) return <SelectCell key={i} onChange={()=>selectionAction.selectAll(data)}
                                                         width={width} align={align}
                                                         checked={selectionAction.isSelectAll(data)}/>;
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
        {
            _.map(columns, (col, i) => {
                const { width, align, bind, convert } = col;
                if(col.selection) return <SelectCell key={i} onChange={()=>selectionAction.selectOne(rowData)}
                                                     width={width} align={align}
                                                     checked={selectionAction.has(rowData)}/>;
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
Cell.defaultProps = {
    align:'left',
}

function SelectCell({onChange,checked,...rest}){
    const {selection} = useContext(TableContext);
    if(!selection) return null;
    return <Cell text={ <Checkbox checked={checked} onChange={onChange}/>} {...rest}/>;
}
