import React,{useContext} from 'react';
import clsx from "clsx";
import _ from "lodash";
import TableContext from "../TableContext";

function Cell({ text, width, align,onClick }) {
    const {option} = useContext(TableContext);
    return <div className={clsx("c-table-cell",align)}
                style={ { width,height:option.rowHeight } }
                onClick={handleClick}>
        { text }
    </div>

    function handleClick(){
        _.isFunction(onClick) && onClick();
    }
}
Cell.defaultProps = {
    align:'left',
}

export default Cell;
