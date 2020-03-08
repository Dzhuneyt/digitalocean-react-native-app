/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Required for React Native Navigation
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
