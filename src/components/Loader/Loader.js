import React from 'react';
import clsx from 'clsx';
import './Loader.scss';

function Loader(props) {
    const loader = <div className="c-loader" style={props.style}>
        <span className={clsx("spin-dot", { "large": props.large })}>
            <i/>
            <i/>
            <i/>
            <i/>
        </span>
        <span className={clsx("text", { "large": props.large })}>{props.text ? props.text : "加载中..."}</span>
    </div>;

    if (props.fill) {
        return <div className="c-loader-container">
            {loader}
        </div>
    } else {
        return loader;
    }
}
export default Loader;
