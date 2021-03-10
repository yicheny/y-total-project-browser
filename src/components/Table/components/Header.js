import React,{useContext} from 'react';
import TableContext from "../TableContext";
import _ from "lodash";
import SelectCell from "./SelectCell";
import { Cell } from "./index";
import { getColCommonProp } from "../utils";
import clsx from "clsx";

export default function Header({ data,columns,headerRef,runtime }) {
    const {xScrollOffset} = runtime.current;
    const {normalColumns,fixedLeftColumns} = columns;

    // console.log('xScrollOffset', xScrollOffset);
    return <div className="c-table-header c-table-row">
        <div className="c-table-header-main" ref={headerRef}>
            <CellGroup columns={fixedLeftColumns} fixedLeft data={data}/>
            <CellGroup columns={normalColumns} data={data}/>
            {xScrollOffset > 0 && <div className="scrollbar" style={{ width: xScrollOffset,flex:'none'}} />}
        </div>
    </div>
}

function CellGroup({columns,fixedLeft,data}){
    const {selectionAction} = useContext(TableContext);

    return <div className={clsx('c-table-cell-group',{fixedLeft})}>
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
