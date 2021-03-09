import React from 'react';
import _ from 'lodash';
import clsx from "clsx";
import './List.scss';

function List({data,header,footer,className,style} ) {
    return (<div className={clsx('c-list',className)} style={style}>
        {
            header && <div className="c-list-header">{header}</div>
        }
        <div className="c-list-content">
            {
                _.map(data,(o,i)=>{
                    return <div className="c-item" key={i}>
                        <span className="c-item-title">{o.title}</span>
                        <span className="c-item-text">{o.text}</span>
                    </div>
                })
            }
        </div>
        {
            footer && <div className="c-list-footer">{footer}</div>
        }
        </div>);
}

export default List;
