import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Table.scss';
import { Content, Header } from "./components";
import TableContext from "./TableContext";
import { getRunTimeColumns } from "./utils";

function getRunTimeOption(option) {
    return option || {}
}

function Table({ columns, data, className, style, defaultSelection, onSelectionChange, option }) {
    const [selection, selectionAction] = useSelection(defaultSelection);
    const { headerRef, setXOffset } = useHeaderRef();
    const tableRef = useRef();
    const contentRef = useRef();
    const runtime = useRef({});

    const runtime_option = useMemo(() => getRunTimeOption(option), [option]);
    const runtime_columns = useMemo(() => getRunTimeColumns(columns, runtime_option), [columns, runtime_option]);

    const { clear } = selectionAction;
    useEffect(() => {
        clear();
    }, [clear, data]);//注意这里的data，删除这个依赖会有bug

    useEffect(() => {
        if (selection) {
            _.isFunction(onSelectionChange) && onSelectionChange(selection);
        }
    }, [selection, onSelectionChange]);

    updateXScrollOffset(runtime, contentRef);

    useResize(tableRef,runtime_columns,runtime_option.fill);

    // console.log(runtime_columns);
    // console.log('runtime',runtime.current);
    return <TableContext.Provider value={ { selection, selectionAction } }>
        <div className={ clsx('c-table', className) }
             style={ style }
             ref={ tableRef }>
            <Header data={ data }
                    runtime={ runtime }
                    columns={ runtime_columns }
                    headerRef={ headerRef }/>
            { _.isEmpty(data) ? <NoData/> : <Content data={ data }
                                                     columns={ runtime_columns }
                                                     contentRef={ contentRef }
                                                     setXOffset={ setXOffset }/> }
        </div>
    </TableContext.Provider>
}

function useResize(tableRef,runtime_columns,fill){
    return useEffect(()=>{
        if(tableRef.current) return resizeObserverInit(tableRef.current)

        function resizeObserverInit(tableElement){
            const resizeObserver = new window.ResizeObserver(()=>{
                if(!fill) return ;
                const columns = mergeColumns(runtime_columns);
                const sourceSumWidth = getSourceSumWidth(columns)
                const tableWidth = getTableWidth();
                if(tableWidth <= sourceSumWidth) return ;
                const runTimeSumWidth = _.max([sourceSumWidth,tableWidth]);
                const rate = getRate();
                columns.forEach(x=>{
                    x.rWidth = x.width * rate;
                })

                function getRate(){
                    return runTimeSumWidth/sourceSumWidth;
                }

                function getTableWidth(){
                    return tableElement.getBoundingClientRect().width;
                }

                function getSourceSumWidth(columns){
                    return _.sumBy(columns,x=>x.width);
                }

                function mergeColumns(s){
                    return _.reduce(s,(acc,x)=>acc.concat(x),[])
                }
            });
            resizeObserver.observe(tableElement);
            return ()=>{
                resizeObserver.unobserve(tableElement);
            };
        }
    },[tableRef,runtime_columns,fill])
}

function updateXScrollOffset(runtime, contentRef) {
    if (contentRef.current) {
        const content = contentRef.current;
        if (content.scrollHeight > content.clientHeight) {
            runtime.current.xScrollOffset = content.offsetWidth - content.clientWidth;
        } else {
            runtime.current.xScrollOffset = 0
        }
    }
}

function NoData() {
    return <div className='c-table-nodata'>
        没有数据
    </div>
}

export default Table;

function useSelection(defaultSelection) {
    const [selection, setSelection] = useState(defaultSelection);

    const clear = useCallback(() => setSelection([]), []);

    const has = useCallback((o) => _.includes(selection, o), [selection])

    const selectOne = useCallback((o) => {
        if (has(o)) {
            _.pull(selection, o);
        } else {
            selection.push(o);
        }
        setSelection(_.clone(selection));
    }, [has, selection])

    const isSelectAll = useCallback((data) => {
        if (!_.get(data, 'length')) return false;
        if (!_.isArray(selection)) return false;
        return selection.length === data.length;
    }, [selection])

    const selectAll = useCallback((data) => {
        if (isSelectAll(data)) {
            return setSelection([])
        }
        setSelection(_.clone(data));
    }, [isSelectAll])

    return [selection, { clear, selectOne, selectAll, has, isSelectAll }]
}

function useHeaderRef() {
    const headerRef = useRef();
    const setXOffset = useCallback((offset) => {
        if (headerRef.current) {
            headerRef.current.scrollLeft = offset;
        }
    }, [])

    return { headerRef, setXOffset }
}
