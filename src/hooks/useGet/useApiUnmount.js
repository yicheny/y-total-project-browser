import { useEffect, useRef } from "react";
import _ from 'lodash';
import { api } from "../../base";

export default function useApiUnmount() {
    const cancel_ref = useRef(api.cancelTokenSourceFor());

    useEffect(() => {
        return () => {
            if (cancel_ref.current) {
                cancel_ref.current.cancel();
                cancel_ref.current = null;
            }
        }
    }, [])

    return { token: _.get(cancel_ref.current,'token') }
}
