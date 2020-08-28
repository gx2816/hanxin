import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './views/login/login'
import Main from './views/main/main'
import Loading from './components/loading'
const App: React.FC = () => {
  return (
    <div className="App">
      <header />
      <Loading />
      <Router>
        <div className="App">
          <Route exact path="/" component={Login}/>
          <Route path="/main" component={Main}/>
        </div>
      </Router>
    </div>
  );
}

export default App;
