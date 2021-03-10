import _ from "lodash";

export function getColCommonProp(col){
    return _.pick(col,['width','align']);
}
