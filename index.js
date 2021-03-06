import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { AuthProvider } from './src/Provider/authProvider';

function ProvidedApp() {
    return <AuthProvider><App /></AuthProvider>
}

AppRegistry.registerComponent(appName, () => ProvidedApp);
