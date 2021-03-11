import React from 'react';
import _ from 'lodash';
import { Switch, Route } from 'react-router-dom';
import StudyRecord from "./views/StudyRecord";
import './App.scss';
import { Menu } from "./components";
import { globalData } from "./base";

const MENU_OPTION = {
    details: [
        { text: 'StudyRecord 成长统计记录', to: "/study-record" },
    ]
};

function App({ history }) {
    if (_.isNil(globalData.user)){
        history.replace('/login');
        return null;
    }

    return (<div className="app">
        <Menu option={ MENU_OPTION }/>
        <div className="app-content">
            <Switch>
                <Route path='/study-record' component={ StudyRecord }/>
                <Route component={ StudyRecord }/>
            </Switch>
        </div>
    </div>);
}

export default App;
