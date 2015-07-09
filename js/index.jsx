import React from 'react';
import App from './components/App.js';
import FastClick from 'fastclick';

React.render(<App/>, document.getElementsByClassName('react')[0]);
FastClick(document.body);
