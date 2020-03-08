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
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar, FlatList,
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import axios from "axios";
import {DigitalOcean} from "./src/digital-ocean";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {DropletsList} from "./src/droplets-list";

declare var global: { HermesInternal: null | {} };

const Stack = createStackNavigator();


class App extends React.Component<any, any> {
    render() {
        return (
            <>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Droplets" component={DropletsList}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </>
        );
    }
}

export default App;
