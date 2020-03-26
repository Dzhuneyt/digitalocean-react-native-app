/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {DropletsList} from "./src/screens/droplets/droplets-list";
import {ConfigureDigitalOceanToken} from "./src/screens/configureDigitalOceanToken";
import {FlatList, StatusBar, Text, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {Button} from "react-native";
import RNRestart from 'react-native-restart';
import {DigitalOceanBaseService} from "./src/services/digitalOceanBaseService";
import firebase from '@react-native-firebase/app';
import {Login} from "./src/screens/Login";

const Stack = createStackNavigator();
const digitalOceanService = new DigitalOceanBaseService();

class App extends React.Component<any, any> {
    state = {
        initialScreen: '',
        readyToRender: false
    };

    render() {
        if (!this.state.readyToRender) {
            return null;
        }
        return (
            <>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName={this.state.initialScreen}>
                        <Stack.Screen name="Login" component={Login}/>
                        <Stack.Screen name="ConfigureDigitalOceanToken" component={ConfigureDigitalOceanToken}/>
                        <Stack.Screen name="Droplets" component={DropletsList}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </>
        );
    }

    componentDidMount(): void {
        AsyncStorage.getItem('digitalocean_token').then(value => {
            if (!value) {
                this.setState({
                    initialScreen: "Login",
                    readyToRender: true,
                });
            } else {
                this.setState({
                    initialScreen: "Droplets",
                    readyToRender: true,
                });
            }
        });
    }
}

export default App;
