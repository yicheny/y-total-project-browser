import { useEffect, useRef } from "react";

/*
@author ylf
*/
export default function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
}
