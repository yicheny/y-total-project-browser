import React, {createContext, useContext, useState,useMemo, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import _ from 'lodash';
import cls from 'clsx';
import { Icon } from '../index';
import {useExpanded} from "../../hooks";
import './Menu.scss';
import clsx from "clsx";

const MenuContext = createContext({});

function Menu({data,indent,defaultZoom}) {
    const history = useHistory();
    const [expands,setExpands] = useState(findExpanded(data));
    const [path,setPath] = useState(history.location.pathname);
    const [zoom,setZoom] = useState(defaultZoom)

    useEffect(()=>{
        let unListen = history.listen(()=>setPath(history.location.pathname));
        return ()=>{
            unListen();
            unListen = undefined;
        };
    },[history]);

    return <MenuContext.Provider value={{indent, action, path,zoom}}>
        <div className="c-menu-wrap">
            <div className='c-zoom-btn' onClick={()=>setZoom(!zoom)}>
                {zoom ? "+" : "="}
            </div>
            <div className={clsx("c-menu",{zoom})}>
                {data.map((e, i) => <MenuItem key={i} data={e} level={1} expands={expands}/>)}
            </div>
        </div>
    </MenuContext.Provider>;

    function action(x) {
        if (arrayHasData(x.children)) {
            if (_.includes(expands, x)) {
                _.pull(expands, x)
            }
            else {
                expands.push(x)
            }
            return setExpands([...expands]);
        }
        if(targetFor(x)) return history.push(targetFor(x));
    }
}
Menu.defaultProps = {
    indent:20,
    defaultZoom:false
}

export default Menu;

function MenuItem(props) {
    const {data, data: {text, title, children}, level, expands} = props;
    const {indent, action, path, zoom} = useContext(MenuContext);
    const expanded = useMemo(() =>_.includes(expands, data), [data, expands]);

    const { containerRef, childRef, transitionEnd } = useExpanded(expanded);
    return <div className='c-menu-item'>
        <div className={cls('c-menu-item-header', {expanded, active: activeFor()})} style={{paddingLeft: level * indent}}
             onClick={() => action(data)}>
            <div className='c-menu-item-header-content'>
                {zoom && title && <span className="c-menu-item-title">{title}</span>}
                {text && <span className="c-menu-item-text">{text}</span>}
            </div>
            {children && <Icon name='arrowDown' size={16}/>}
        </div>
        {children && <div className="c-menu-sub" ref={containerRef} onTransitionEnd={transitionEnd}>
            <div className="c-menu-item-container" ref={childRef}>
                {children.map((e, i) => <MenuItem key={i} data={e} level={level + 1} expands={expands}/>)}
            </div>
        </div>}
    </div>;

    function activeFor() {
        return expanded ? false : pathCheck(data,path);
    }
}

function findExpanded(data, array = []) {
    if (!Array.isArray(array)) array = [];
    _.forEach(data, o => {
        if (o.expanded && arrayHasData(o.children)) array.push(o);
        findExpanded(o.children, array);
    });
    return array;
}

function arrayHasData(x) {
    return Array.isArray(x) && x.length > 0
}

function targetFor(x={}){
    let target = x.to;
    if(!target) target = x.text;
    if(target && !_.startsWith(target,'/')) target = '/'.concat(target);
    return target;
}

function pathCheck(data,path) {
    if(arrayHasData(data.children)){
        return data.children.some(o=>pathCheck(o,path))
    }
    const target = targetFor(data);
    return path === target || (_.startsWith(path, target) && path[target.length] === "/");
}
