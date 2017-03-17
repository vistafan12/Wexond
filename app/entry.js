'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './browser/components/window/app';
import {Expo} from 'gsap';

tabsAnimationsData.animationEasing = Expo.easeOut;

ReactDOM.render(<App/>, document.getElementById("app"));
