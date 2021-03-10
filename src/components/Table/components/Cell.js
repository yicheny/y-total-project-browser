import React from 'react';
import clsx from "clsx";
import _ from "lodash";

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

export default Cell;
