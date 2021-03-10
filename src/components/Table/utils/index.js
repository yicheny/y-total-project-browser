import _ from "lodash";

export function getColCommonProp(col){
    return {
        align:col.align,
        width:col.rWidth
    };
}

export function getRunTimeColumns(columns,option) {
    setWidthToRWidth(columns);

    const {fixedLeftCount,fixedRightCount} = option;
    if(!fixedLeftCount && !fixedRightCount) return getNoLeftAndNoRightColumns();
    if(fixedLeftCount && !fixedRightCount) return getHasLeftAndNoRightColumns();
    if(!fixedLeftCount && fixedRightCount) return getNoLeftAndHasRightColumns();
    return getHasLeftAndHasRightColumns();

    function setWidthToRWidth(columns){
        _.forEach(columns,x=>{
            x.rWidth = x.width;
        })
    }

    function getNoLeftAndNoRightColumns(){
        return {
            fixedLeftColumns:[],
            normalColumns:setDefaultProp(columns),
            fixedRightColumns:[]
        };
    }

    function getHasLeftAndNoRightColumns(){
        return {
            fixedLeftColumns: setDefaultProp(columns.slice(0,fixedLeftCount)),
            normalColumns: setDefaultProp(columns.slice(fixedLeftCount)),
            fixedRightColumns:[]
        }
    }

    function getNoLeftAndHasRightColumns(){
        return {
            fixedLeftColumns:[],
            normalColumns: setDefaultProp(columns.slice(0,fixedRightCount)),
            fixedRightColumns: setDefaultProp(columns.slice(fixedRightCount*-1)),
        }
    }

    function getHasLeftAndHasRightColumns(){
        return {
            fixedLeftColumns:setDefaultProp(columns.slice(0,fixedLeftCount)),
            normalColumns: setDefaultProp(columns.slice(fixedLeftCount,fixedRightCount*-1)),
            fixedRightColumns: setDefaultProp(columns.slice(fixedRightCount*-1)),
        }
    }

    function setDefaultProp(columns){
        return _.map(columns,setOneDefaultProp)

        function setOneDefaultProp(col){
            if(col.selection) return setSelectionCol();
            return setNormalCol();

            function setNormalCol(){
                return _.assign({
                    width: 100,
                    convert:v=>v,
                }, col);
            }

            function setSelectionCol(){
                return _.assign({
                    width: 40,
                    align: 'center',
                },col);
            }
        }
    }
}
