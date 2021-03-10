import React,{useContext} from 'react';
import TableContext from "../TableContext";
import _ from "lodash";
import SelectCell from "./SelectCell";
import { Cell } from "./index";
import { getColCommonProp } from "../utils";
import clsx from "clsx";

export default function Header({ data,columns,headerRef,runtime }) {
    const {xScrollOffset} = runtime.current;

    // console.log('xScrollOffset', xScrollOffset);
    return <div className="c-table-header c-table-row">
        <div className="c-table-header-main" ref={headerRef}>
            <CellGroup columns={columns.fixedLeftColumns} fixedLeft data={data}/>
            <CellGroup columns={columns.normalColumns} data={data}/>
            <CellGroup columns={columns.fixedRightColumns} fixedRight data={data}
                       style={{right:xScrollOffset}}/>
            {xScrollOffset > 0 && <div className={clsx("scrollbar",{fixedRight:columns.fixedRightColumns.length})}
                                       style={{ width: xScrollOffset}} />}
        </div>
    </div>
}

function CellGroup({columns,fixedLeft,fixedRight,data,style}){
    const {selectionAction} = useContext(TableContext);

    return <div className={clsx('c-table-cell-group',{fixedLeft,fixedRight})} style={style}>
        {
            _.map(columns, (col, i) => {
                const { header } = col;
                const commonProps = getColCommonProp(col);
                if(col.selection) return <SelectCell key={i} {...commonProps}
                                                     onChange={()=>selectionAction.selectAll(data)}
                                                     checked={selectionAction.isSelectAll(data)}/>;
                return <Cell key={ i } {...commonProps} text={ header }/>
            })
        }
    </div>
}
