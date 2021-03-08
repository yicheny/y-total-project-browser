import React from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './Table.scss';

function getRunTimeCol(col) {
    return _.assign({
        width: 100,
        align: 'left',
        convert: v => v,
    }, col);
}

function Table({ columns, data, className, style }) {
    return (<div className={ clsx('c-table', className) } style={ style }>
        <Header columns={ columns }/>
        <Content data={ data } columns={ columns }/>
    </div>);
}

export default Table;

function Header({ columns }) {
    return <div className="c-table-header c-table-row">
        {
            _.map(columns, (col, i) => {
                const { width, align, header } = getRunTimeCol(col);
                return <Cell key={ i }
                             width={ width }
                             align={ align }
                             text={ header }/>
            })
        }
    </div>
}

function Content({ data, columns }) {
    return <div className="c-table-content">
        { _.map(data, (o, i) => {
            return <Row key={ i } data={ o } columns={ columns }/>
        }) }
    </div>;
}

function Row(props) {
    const { data, columns } = props;

    return <div className="c-table-row">
        {
            _.map(columns, (col, i) => {
                const { width, align, bind, convert } = getRunTimeCol(col);
                return <Cell key={ i }
                             width={ width }
                             align={ align }
                             text={ convert(data[ bind ]) }/>
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
