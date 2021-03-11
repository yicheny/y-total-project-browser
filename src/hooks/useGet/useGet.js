import { useEffect, useCallback } from 'react';
import _ from 'lodash';
import { usePrevious } from "../index";
import { api,tryExecute } from "../../utils";
import useApiStatus from "./useApiStatus";
import useApiUnmount from "./useApiUnmount";

/*
@author ylf
*/
export default function useGet(url) {
    const [status, actions] = useApiStatus();
    const { token } = useApiUnmount();
    const pre = usePrevious(status);
    const update = useUpdate(pre, token, actions);
    useAutoUpdate(url, update);
    return { ...status, doFetch: update };
}

function useAutoUpdate(url, update) {
    useEffect(() => {
        if (_.isString(url) || _.isArray(url)) update(url);
    }, [url, update]);
}

function useUpdate(pre, token, actions) {
    return useCallback((url) => {
        actions.reset(pre.current);
        if (_.isArray(url)) return tryExecute(fetchUrls, actions.reject);
        return tryExecute(fetchUrl, actions.reject);

        async function fetchUrls() {
            const res = await Promise.all(_.map(url, o => api.get(o, token)));
            const data = _.map(res, v => v.data);
            actions.resolve(data);
            return data;
        }

        async function fetchUrl() {
            const data = (await api.get(url, token)).data;
            actions.resolve(data)
            return data;
        }
    }, [pre, token, actions]);
}
