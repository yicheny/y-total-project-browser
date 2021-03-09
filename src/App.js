import React from 'react';
import { Switch, Route } from 'react-router-dom';
import StudyRecord from "./views/StudyRecord";
import './App.scss';
import { Menu } from "./components";

const MENU_OPTION = {
    details:[
        {text:'StudyRecord 成长统计记录',to:"/study-record"},
    ]
};

function App() {
  return (<div className="app">
        <Menu option={MENU_OPTION} />
        <div className="app-content">
            <Switch>
                <Route path='/study-record' component={StudyRecord} />
                <Route component={StudyRecord} />
            </Switch>
        </div>
    </div>);
}

export default App;
