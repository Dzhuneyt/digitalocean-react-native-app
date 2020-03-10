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
import {DropletsList} from "./src/screens/droplets-list";
import {Login} from "./src/screens/login";
import AsyncStorage from "@react-native-community/async-storage";
import {Button} from "react-native";
import {Text} from "react-native-elements";
import RNRestart from 'react-native-restart';
import {DigitalOceanService} from "./src/services/digital-ocean.service";

const Stack = createStackNavigator();
const digitalOceanService = new DigitalOceanService();

const logout = () => {
    AsyncStorage.removeItem('digitalocean_token').then(value => {
        RNRestart.Restart()
    });
};

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
                        <Stack.Screen name="Droplets" component={DropletsList}
                                      options={{
                                          headerRight: () => (
                                              <Text
                                                  style={{marginRight: 10}}
                                                  onPress={() => logout()}
                                              >Logout</Text>
                                          ),
                                      }}
                        />
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
