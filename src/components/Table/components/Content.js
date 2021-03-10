import React,{useContext} from 'react';
import TableContext from "../TableContext";
import clsx from "clsx";
import _ from "lodash";
import { Cell, SelectCell } from "./index";
import { getColCommonProp } from "../utils";

export default function Content({ data, columns, contentRef,setXOffset }) {
    return <div className="c-table-content">
        <div className="c-table-content-main" ref={contentRef} onScroll={handleScroll}>
            { _.map(data, (o, i) => {
                return <Row key={ i } rowData={ o } columns={ columns } rowIndex={i}/>
            }) }
        </div>
    </div>;

    function handleScroll(e){
        setXOffset(e.target.scrollLeft);
    }
}

function Row({  columns, ...rest }) {

    return <div className="c-table-row">
        <CellGroup columns={columns.fixedLeftColumns} fixedLeft {...rest}/>
        <CellGroup columns={columns.normalColumns} {...rest}/>
        <CellGroup columns={columns.fixedRightColumns} fixedRight {...rest}/>
    </div>
}

function CellGroup({columns,fixedLeft,fixedRight,rowData,rowIndex}){
    const {selectionAction} = useContext(TableContext);

    return <div className={clsx('c-table-cell-group',{fixedLeft,fixedRight})}>
        {
            _.map(columns, (col, i) => {
                const { bind, convert } = col;
                const commonProps = getColCommonProp(col);
                if(col.selection) return <SelectCell key={i} {...commonProps}
                                                     onChange={()=>selectionAction.selectOne(rowData)}
                                                     checked={selectionAction.has(rowData)}/>;
                return <Cell key={ i }  {...commonProps} text={ convert(_.get(rowData,bind),rowData,rowIndex) }/>
            })
        }
    </div>
}
