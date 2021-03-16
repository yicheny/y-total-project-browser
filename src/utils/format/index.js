import {createTime} from "../index";

export default function format(t){
    const methods = {
        "YYYY-MM-DD":function (v){
            const d = new Date(v);
            return createTime(d).format("YYYY-MM-DD").value;
        }
    }

    return methods[t];
}
