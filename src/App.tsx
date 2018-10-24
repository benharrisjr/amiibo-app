import * as React from 'react';
import './App.css';
import Search from './Search/searchBar';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Amiibo App</h1>
        </header>
          <Search />
      </div>
    );
  }
}

export default App;
