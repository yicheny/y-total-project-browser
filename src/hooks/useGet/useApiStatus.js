import { useMemo, useState } from "react";

export default function useApiStatus() {
    const [status, setState] = useState({ data: null, loading: true, error: null });

    const actions = useMemo(() => {
        return {
            reset(preStatus) {
                const { loading, data, error } = preStatus;
                if (!loading) setState({ data, loading: true, error });
            },

            reject(error) {
                setState({ data: null, loading: false, error });
            },

            resolve(data) {
                setState({ data, loading: false, error: null })
            },
        }
    }, [])

    return [status, actions]
}
