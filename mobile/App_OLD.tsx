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
import {DOAccountManager} from "./src/modules/auth/DOAccountManager";
import {Login} from "./src/modules/auth/Login";
import {DropletList} from "./src/modules/droplet-management/DropletList";
import auth from "@react-native-firebase/auth";
import {Provider as PaperProvider} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

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
                <PaperProvider>
                    <NavigationContainer>
                        <Drawer.Navigator
                            screenOptions={{
                                headerShown: false,
                            }}
                            initialRouteName={this.state.initialScreen}>
                            <Drawer.Screen
                                name="Login"
                                component={Login}
                                options={{
                                    title: 'Login',
                                    drawerIcon: props => null,
                                    drawerLabel: () => null,
                                }}
                            />
                            <Drawer.Screen
                                name="DOAccountManager"
                                component={DOAccountManager}
                                options={{title: 'DigitalOcean - API Keys'}}
                            />
                            <Drawer.Screen
                                name="Droplets"
                                component={DropletList}
                                options={{title: 'DigitalOcean - Droplets Management'}}
                            />
                        </Drawer.Navigator>
                    </NavigationContainer>
                </PaperProvider>
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
