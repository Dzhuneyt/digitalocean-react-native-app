/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AsyncStorage from "@react-native-community/async-storage";
import {DOAccountManager} from "./src/modules/auth/DOAccountManager";
import {Login} from "./src/modules/auth/Login";
import {DropletList} from "./src/modules/droplet-management/DropletList";
import auth from "@react-native-firebase/auth";

const Stack = createStackNavigator();

class App extends React.Component<any, any> {
    state = {
        initialScreen: '',

        // Before this is set to true, the app shows nothing
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
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{title: 'Login'}}
                        />
                        <Stack.Screen
                            name="DOAccountManager"
                            component={DOAccountManager}
                            options={{title: 'DigitalOcean Accounts'}}
                        />
                        <Stack.Screen
                            name="Droplets"
                            component={DropletList}
                            options={{title: 'Droplets'}}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </>
        );
    }

    componentDidMount(): void {
        if (auth().currentUser) {
            this.setState({
                initialScreen: "DOAccountManager",
                readyToRender: true,
            });
        } else {
            this.setState({
                initialScreen: "Login",
                readyToRender: true,
            });
        }
    }
}

export default App;
