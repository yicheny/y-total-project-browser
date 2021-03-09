import React from 'react';
import cls from 'clsx';
import './Icon.scss';

function Icon(props) {
    let {name,size,style,className,color} = props;

    return <i className={cls('iconfont',`icon-${name}`,className)}
               style={{...style,fontSize:size,color}}>
    </i>;
}
Icon.defaultProps={
    name:'',
    size:16,
    style:{},
    className:'',
};

export default Icon;
