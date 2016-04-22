import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import FastClick from 'fastclick';

ReactDOM.render(<App/>, document.getElementsByClassName('react')[0]);
FastClick(document.body);
