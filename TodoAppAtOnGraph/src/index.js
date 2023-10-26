import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store'
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Auth0Provider
    // domain="dev-m23qna10sa6g1ktm.us.auth0.com"
    // clientId="e7mHrWXsOcy3v7CF3fBgIoZ6lhsim485"
    domain="dev-m23qna10sa6g1ktm.us.auth0.com"
    clientId="xvOOY06oT6Jcu0sF3XvJFdLAFyTEOj7D"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
  <Provider store={store}>
    <App />
  </Provider>
  </Auth0Provider>
  // </React.StrictMode>
);

