import React from "react";
import {Alert, FlatList, Linking, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Button, Card, Header, Icon, Overlay} from "react-native-elements";
import auth from '@react-native-firebase/auth';
import {DOAccountManager_CreateNewToken} from "./DOAccountManager_CreateNewToken";
import firestore from "@react-native-firebase/firestore";
import {getAlias, getAliasDocumentReference} from "../../helpers/digitalocean";
import {Token} from "../../interfaces/Token";
import ActionButton from "react-native-action-button";

export class DOAccountManager extends React.Component<{
    // Props
    navigation: any
}, {
    isDialogForNewTokenVisible: boolean,
    accounts: Token[],
}> {

    state = {
        isDialogForNewTokenVisible: false,
        accounts: [],
    };


    render() {
        if (this.state.isDialogForNewTokenVisible) {
            return <>
                <Overlay
                    animated={true}
                    animationType={'slide'}
                    fullScreen={true}
                    isVisible={this.state.isDialogForNewTokenVisible}
                    onBackdropPress={() => this.setState({
                        isDialogForNewTokenVisible: false,
                    })}
                >
                    <DOAccountManager_CreateNewToken/>
                </Overlay>
            </>;
        }

        if (!this.state.accounts.length) {
            return <>
                <Card>
                    <Text style={{textAlign: 'left', marginBottom: 10}}>Please configure your DigitalOcean Personal
                        Access
                        Token
                        below.</Text>
                    <Text style={{textAlign: 'left', marginBottom: 10}}>It serves as a replacement for your username and
                        password and allows
                        this app to interact
                        with resources in your DigitalOcean account (e.g. create droplets).</Text>

                    {/* Button, when pressed, opens the "Create new token" dialog */}
                    <Button
                        containerStyle={{
                            marginTop: 20
                        }}
                        title="Create a new token"
                        onPress={() => this.setState({isDialogForNewTokenVisible: true})}
                    />
                </Card>
            </>;
        }
        return <>
            <Header
                statusBarProps={{translucent: true}}
                placement="left"
                leftComponent={{
                    icon: 'menu', color: '#fff', onPress: () => {
                        alert('bla')
                    }
                }}
                centerComponent={{text: 'DigitalOcean - Accounts (API keys)', style: {color: '#fff'}}}
                rightComponent={{icon: 'home', color: '#fff'}}
            />
            {this.state.accounts &&
            <FlatList
                data={this.state.accounts}
                keyExtractor={(item: Token) => String(item.alias + item.token)}
                renderItem={({item}) => <>
                    <Card>
                        <View
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                            }}>
                            <TouchableHighlight
                                style={{
                                    flexGrow: 1,
                                }}
                                onPress={() => this.goToDropletListingForAlias(item.alias)}>
                                <Text>Name: {item.alias}</Text>
                            </TouchableHighlight>
                            <Button
                                style={{}}
                                title=' Droplets'
                                accessibilityLabel='Droplets listing'
                                icon={() => <Icon color="#fff" name='dns' type='material'/>}
                                onPress={() => this.goToDropletListingForAlias(item.alias)}
                            />
                            <View style={{width: 10}}/>
                            <Button
                                style={{}}
                                accessibilityLabel='Delete droplet'
                                icon={() => <Icon color="#fff" name='delete'/>}
                                onPress={() => {
                                    Alert.alert(
                                        "Delete API key",
                                        "Are you sure you want to remove this API key from the app?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {text: "Yes", onPress: () => this.deleteAlias(item.alias)}
                                        ],
                                        {cancelable: false}
                                    );


                                }}
                            />
                        </View>

                    </Card>
                </>}
            />
            }
            <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item
                    buttonColor="#6ec6ff"
                    title="What is a DigitalOcean API key?"
                    onPress={() => this.openTokenInstructionsUrl()}>
                    <Icon color='#fff' name="help" style={styles.actionButtonIcon}/>
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor="#2196f3"
                    title="Add an API key"
                    onPress={() => this.setState({isDialogForNewTokenVisible: true})}>
                    <Icon color='#fff' name="add-circle" style={styles.actionButtonIcon}/>
                </ActionButton.Item>
            </ActionButton>
        </>
            ;
    }

    private async getCurrentTokens() {
        const currentUser = auth().currentUser;

        if (!this.checkForLogin() || !currentUser) {
            throw new Error('Failed to get current user');
        }

        /**
         * Format Firebase snapshot and set it as component state
         * @param snapshot
         */
        const _processSnapshot = (snapshot: any) => {
            if (!snapshot) {
                this.setState({
                    accounts: [],
                });
                return;
            }
            const accounts: Token[] = [];
            snapshot.forEach((item: { ref: { id: any; }; get: (arg0: string) => any; }) => {
                const obj: Token = {
                    alias: item.ref.id,
                    token: String(item.get('token')),
                };
                if (item.get('created_at')) {
                    obj.created_at = Number(item.get('created_at'));
                }
                accounts.push(obj);
            });
            this.setState({
                accounts,
            });
            console.log('New DO accounts list received and set in UI:', JSON.stringify(accounts.length, null, 2));
        };

        // Get current snapshot immediately (don't wait for online sync)
        const snapshot = await firestore()
            .collection('digitalocean_tokens')
            .doc(currentUser.uid)
            .collection("tokens")
            .get();

        _processSnapshot(snapshot);

        // Listen for changes on the Firestore real-time and reflect in component every time
        firestore()
            .collection('digitalocean_tokens')
            .doc(currentUser.uid)
            .collection("tokens")
            .onSnapshot(snapshot => {
                _processSnapshot(snapshot);
            }, error => {
                // @TODO send this error to Firebase Crashlytics
                console.log(error);
                _processSnapshot([]);
            });
    }

    async componentDidMount(): Promise<any> {
        await this.getCurrentTokens();

        if (this.state.accounts.length === 0) {
            // If on load there are no DO accounts,
            // Open the account creation dialog
            this.setState({
                isDialogForNewTokenVisible: true,
            });
        }
    }

    /**
     * If not logged in, redirect to login page
     * @private
     */
    private checkForLogin() {
        if (!auth().currentUser) {
            this.props.navigation.replace("Login", {name: 'Login'});
            return false;
        }
        return true;
    }

    async goToDropletListingForAlias(alias: string) {
        const doc = await getAlias(alias);
        this.props.navigation.navigate("Droplets", {
            alias: doc.ref.id,
        });
    }

    private deleteAlias(alias: any) {
        getAliasDocumentReference(alias)
            .then(doc => {
                doc.delete().then(() => {
                    console.log('DO account delete success');
                }).catch(err => {
                    console.error(err);
                })
            })
            .catch(reason => {
                console.error(reason);
            })
    }

    openTokenInstructionsUrl() {
        const url = 'https://www.digitalocean.com/docs/apis-clis/api/create-personal-access-token/';
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
