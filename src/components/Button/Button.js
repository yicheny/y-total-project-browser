import React from 'react';
import cls from 'clsx';
import './Button.scss';

function Button({className,children,primary,text,disabled,cancel,danger,style,onClick}) {
    return <span className={cls('c-button',className,{text,primary,cancel,disabled,danger})}
                 style={style} onClick={onClick}>
            {children}
        </span>;
}

export default Button;
