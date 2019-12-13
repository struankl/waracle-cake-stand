import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Header, CakeList, ViewCake } from './components';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <main>
          <Switch>
            <Route path="/new">
              <ViewCake />
            </Route>
            <Route path="/:cakeId">
              <ViewCake />
            </Route>
            <Route path="/">
              <CakeList />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
