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
import AsyncStorage from "@react-native-community/async-storage";
import {Login} from "./src/components/Login";
import {DropletList} from "./src/components/droplets/DropletList";
import {ConfigureDigitalOceanToken} from "./src/components/ConfigureDigitalOceanToken";

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
                            name="ConfigureDigitalOceanToken"
                            component={ConfigureDigitalOceanToken}
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
        // @TODO Get logged in state
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
