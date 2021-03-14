import React from 'react';
import _ from 'lodash';
import FormContext from "./FormContext";

function Form({value,onChange,children}) {
    const handleInputChange = (bind,v) => {
        const nextValue = _.clone(value);
        nextValue[bind] = v;
        if (_.isFunction(onChange)) onChange(nextValue, bind);
    };

    return <FormContext.Provider value={{formValue:value,handleInputChange}}>
        {children}
    </FormContext.Provider>
}

export default Form;
