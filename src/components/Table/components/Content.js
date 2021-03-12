import React, { useState, useContext, useMemo } from 'react';
import TableContext from "../TableContext";
import clsx from "clsx";
import _ from "lodash";
import { Cell, SelectCell } from "./index";
import { getColCommonProp } from "../utils";

export default function Content({ data, columns, contentRef, setXOffset, option }) {
    const [topElementCount, setTopElementCount] = useState(0);

    const { rowHeight } = option;

    const virtualizedCount = Math.ceil(_.get(contentRef.current,'clientHeight',0) / rowHeight);

    const renderRows = useMemo(() => {
        return _.slice(data, topElementCount, topElementCount + virtualizedCount);
    }, [data, topElementCount, virtualizedCount]);

    return <div className="c-table-content" onScroll={ handleScroll } ref={ contentRef }>
        <div className="c-table-content-main"
             style={{height:(data.length * rowHeight)}}>
            { _.map(renderRows, (o, i) => {
                const index = i+topElementCount;
                return <Row key={ index } style={{top:index*rowHeight}}
                            rowData={ o } columns={ columns } rowIndex={ index }/>
            }) }
        </div>
    </div>;

    function handleScroll(e) {
        setXOffset(e.target.scrollLeft);
        if (option.virtualized) {
            setTopElementCount(Math.floor(e.target.scrollTop / rowHeight))
        }
    }
}

function Row({ columns,style, ...rest }) {
    return <div className="c-table-row" style={style}>
        <CellGroup columns={ columns.fixedLeftColumns } fixedLeft { ...rest }/>
        <CellGroup columns={ columns.normalColumns } { ...rest }/>
        <CellGroup columns={ columns.fixedRightColumns } fixedRight { ...rest }/>
    </div>
}

function CellGroup({ columns, fixedLeft, fixedRight, rowData, rowIndex }) {
    const { selectionAction } = useContext(TableContext);

    return <div className={ clsx('c-table-cell-group', { fixedLeft, fixedRight }) }>
        {
            _.map(columns, (col, i) => {
                const { bind, convert } = col;
                const commonProps = getColCommonProp(col);
                if (col.selection) return <SelectCell key={ i } { ...commonProps }
                                                      onChange={ () => selectionAction.selectOne(rowData) }
                                                      checked={ selectionAction.has(rowData) }/>;
                return <Cell key={ i }  { ...commonProps } text={ convert(_.get(rowData, bind), rowData, rowIndex) }/>
            })
        }
    </div>
}
