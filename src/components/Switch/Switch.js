import React, {useState} from 'react';
import clsx from "clsx";
import './Switch.scss';

function Switch({defaultChecked,onChange,checkedChildren,unCheckedChildren,className,style}) {
    const [checked,setChecked] = useState(defaultChecked);

    return <span className={clsx("c-switch",{checked},className)} onClick={handleClick} style={style}>
        <span className="c-switch-dot"/>
        <span className="c-switch-inner">{checked ? checkedChildren : unCheckedChildren}</span>
    </span>

    function handleClick(){
        const nextChecked = !checked;
        setChecked(nextChecked);
        if(onChange) onChange(nextChecked)
    }
}
Switch.defaultProps={
    defaultChecked:false,
    checkedChildren:null,
    unCheckedChildren:null
}

export default Switch;
