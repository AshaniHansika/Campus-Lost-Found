import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routers, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConfigProvider } from 'antd' ; 
import './App.css';


//Layout components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

//Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from '.pages/Register';
import ItemDetails from '/pages/ItemDetails';
import CreateItem from './pages/CreateItem';
import Dashboard from './pages/Dashboard';
import ClaimDetails from './pages/ClaimDetails';
import AdminPanel from './pages/AdminPanel';

const queryClient = QueryClient();


function App() {
  return (  
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
