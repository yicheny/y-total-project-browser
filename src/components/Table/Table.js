import React from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Table.scss';

function getRunTimeCol(col){
    return _.assign({width:100,align:'left'},col);
}

function Table(props) {
    const { columns, data, className, style } = props;

    return (<div className={ clsx('c-table', className) } style={ style }>
        <div className="c-table-header c-table-row">
            {
                _.map(columns, (col, i) => {
                    const col_run_time = getRunTimeCol(col);
                    return <Cell key={ i }
                                 width={col_run_time.width}
                                 align={col_run_time.align}
                                 text={ col_run_time.header }/>
                })
            }
        </div>

        <div className="c-table-content">
            { _.map(data, (o, i) => {
                return <Row key={ i } data={ o } columns={ columns }/>
            }) }
        </div>
    </div>);
}

export default Table;

function Row(props) {
    const { data, columns } = props;

    return <div className="c-table-row">
        {
            _.map(columns, (col, i) => {
                const col_run_time = getRunTimeCol(col);
                return <Cell key={ i }
                             width={col_run_time.width}
                             align={col_run_time.align}
                             text={ data[ col_run_time.bind ] }/>
            })
        }
    </div>
}

function Cell(props) {
    const { text, width, align } = props;

    return <div className="c-table-cell" style={ { width, textAlign: align } }>
        { text }
    </div>
}
