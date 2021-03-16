import React from 'react';
import _ from 'lodash';
import { Switch, Route } from 'react-router-dom';
import StudyRecord from "./views/StudyRecord";
import './App.scss';
import { Menu } from "./components";
import { globalData } from "./base";

const MENU_DATA= [
    { title:"SR", text: 'StudyRecord 成长统计记录', to: "/study-record" },
];

function App({ history,location }) {
    if (_.isNil(globalData.user)){
        let url = '/login';
        if(location.pathname && location.pathname.length > 1){
            url = `/login?return=${escape(location.pathname + location.search)}`;
        }
        history.replace(url);
        return null;
    }

    return (<div className="app">
        <Menu data={ MENU_DATA }/>
        <div className="app-content">
            <Switch>
                <Route path='/study-record' component={ StudyRecord }/>
                <Route component={ StudyRecord }/>
            </Switch>
        </div>
    </div>);
}

export default App;
