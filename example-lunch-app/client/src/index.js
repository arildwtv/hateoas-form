import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { Provider } from 'react-redux';
import hateoasForm, { HateoasProvider } from 'hateoas-form';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  combineReducers({
    form
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const hateoasFormInstance = hateoasForm();

ReactDOM.render(
  <Provider store={store}>
    <HateoasProvider hateoasForm={hateoasFormInstance}>
      <App url="/api" />
    </HateoasProvider>
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
