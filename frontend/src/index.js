import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import { AppContextProvider } from "./appContext";
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

root.render(
  <AppContextProvider>
    {/* <React.StrictMode> */}
      <App/>
    {/* </React.StrictMode> */}
  </AppContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
