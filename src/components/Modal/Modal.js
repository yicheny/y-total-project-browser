import React, { Fragment, useCallback, useRef } from 'react';
import clsx from "clsx";
import _ from "lodash";
import { Icon, Button } from "../index";
import './Modal.scss'

//UI组件
function Modal({ visible, move, children, header, footerVisible, confirm, cancel,
                   confirmText, cancelText, confirmVisible, cancelVisible, className,style }) {

    let initialPosition = null;//移动开始的位置
    let saveOffset = { x: 0, y: 0 };//移动停止时的位移数值
    const modalRef = useRef(null);

    const handleCancel = useCallback((e) => {
        eventExecute(cancel, e)
    }, [cancel]);

    const handleConfirm = useCallback((e) => {
        eventExecute(confirm, e)
    }, [confirm]);

    return <Fragment>
        {
            visible && <div className='c-modal-wrapper' onMouseMove={ handleMouseMove } onMouseUp={ clearPosition }
                            onMouseLeave={ clearPosition }>
                <div className={ clsx("c-modal", className) } style={ style } ref={ modalRef }>
                    <div className="c-modal-header" onMouseDown={ handleMouseDown }>
                        <span className="c-modal-header-title">{ header }</span>
                        <span className="c-modal-header-exit" onClick={ handleCancel }><Icon name='cancel' size={ 12 }/></span>
                    </div>
                    <div className="c-modal-content">
                        { children }
                    </div>
                    {
                        footerVisible && <div className="c-modal-footer">
                            { confirmVisible && <Button primary onClick={ handleConfirm }>{ confirmText }</Button> }
                            { cancelVisible && <Button cancel onClick={ handleCancel }>{ cancelText }</Button> }
                        </div>
                    }
                </div>
            </div>
        }
    </Fragment>;

    function handleMouseDown(e) {
        initialPosition = _.pick(e, ['clientX', 'clientY']);
    }

    function handleMouseMove(e) {
        if (move && initialPosition) {
            const { x, y } = offsetFor(e);
            modalRef.current.style.transform = `translate(${ x }px,${ y }px)`
        }
    }

    function clearPosition(e) {
        if (initialPosition) saveOffset = offsetFor(e);
        initialPosition = null;
    }

    function offsetFor(e) {
        const x = e.clientX - initialPosition.clientX + saveOffset.x;
        const y = e.clientY - initialPosition.clientY + saveOffset.y;
        return { x, y };
    }
}

Modal.defaultProps = {
    visible: false,
    move: false,
    header: "默认标题",
    confirm: () => {
    },
    cancel: () => {
    },
    confirmText: '确定',
    cancelText: '取消',
    footerVisible: true,
    confirmVisible: true,
    cancelVisible: true
};

export default Modal;

//逻辑函数
export function eventExecute(cb, ...params) {
    return _.isFunction(cb) && cb(...params);
}
