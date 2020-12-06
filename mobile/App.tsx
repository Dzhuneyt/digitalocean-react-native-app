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
import {DOAccountManager} from "./src/modules/auth/DOAccountManager";
import {Login} from "./src/modules/auth/Login";
import auth from "@react-native-firebase/auth";
import {
    Button,
    Dialog,
    Divider,
    Drawer,
    Menu,
    Portal,
    Provider as PaperProvider,
    RadioButton,
    Text
} from 'react-native-paper';
import {View} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {DropletList} from "./src/modules/droplet-management/DropletList";

const drawerNavigator = createDrawerNavigator();

// @ts-ignore
function DrawerContent({navigation}) {
    const [switchAccountDialogVisible, setSwitchAccountDialogVisible] = React.useState(false);
    return (
        <View style={{flex: 1}}>

            <Text style={{alignSelf: "center"}}>Current account: default</Text>
            <Menu
                visible={false}
                onDismiss={() => null}
                anchor={
                    <Button onPress={() => setSwitchAccountDialogVisible(true)}>
                        Switch account
                    </Button>
                }>
                <Menu.Item onPress={() => {
                }} title="Item 1"/>
                <Menu.Item onPress={() => {
                }} title="Item 2"/>
                <Menu.Item onPress={() => {
                }} title="Item 3"/>
            </Menu>
            <Divider/>
            <Drawer.Section>
                <Drawer.Item
                    label="Droplets"
                    active={false}
                    onPress={() => navigation.navigate('Droplets')}
                />
                <Drawer.Item
                    label="Privacy Policy"
                    active={false}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                />
            </Drawer.Section>
            <Portal>
                <Dialog visible={switchAccountDialogVisible} onDismiss={() => {
                }}>
                    <Dialog.Title>Select account</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={value => null} value={""}>
                            <RadioButton.Item label="First item" value="first"/>
                            <RadioButton.Item label="Second item" value="second"/>
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    );
}

export const RootNavigator = () => {
    return (
        <drawerNavigator.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName={"Accounts"}
            drawerType={"slide"}
            drawerStyle={{width: 200, marginTop: 30}}
            drawerContent={(props: JSX.IntrinsicAttributes & { navigation: any; }) => <DrawerContent {...props}/>}>
            <drawerNavigator.Screen
                name="Login"
                component={Login}
                options={{
                    title: 'Login',
                    drawerIcon: props => null,
                    drawerLabel: () => null,
                }}
            />
            <drawerNavigator.Screen
                name="Accounts"
                component={DOAccountManager}
                options={{title: 'DigitalOcean - Accounts'}}
            />
            <drawerNavigator.Screen
                name="Droplets"
                component={DropletList}
                options={{title: 'DigitalOcean - Droplets'}}
            />
        </drawerNavigator.Navigator>
    );
};

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
                        <RootNavigator/>
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
