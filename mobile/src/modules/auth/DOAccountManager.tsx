import React from "react";
import {FlatList, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Button, Card, Icon, Overlay} from "react-native-elements";
import auth from '@react-native-firebase/auth';
import {DOAccountManager_CreateNewToken} from "./DOAccountManager_CreateNewToken";
import firestore from "@react-native-firebase/firestore";
import {getAlias, getAliasDocumentReference} from "../../helpers/digitalocean";
import {Token} from "../../interfaces/Token";
import FAB from 'react-native-fab'

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
                    fullScreen={false}
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
                                <Text>{item.alias}</Text>
                            </TouchableHighlight>
                            <Button
                                style={{}}
                                title={"Droplets"}
                                onPress={() => this.goToDropletListingForAlias(item.alias)}
                            />
                            <View style={{width: 10}}/>
                            <Button
                                style={{}}
                                title={"Delete"}
                                onPress={() => this.deleteAlias(item.alias)}
                            />
                        </View>

                    </Card>
                </>}
            />
            }
            <FAB buttonColor="green"
                 iconTextColor="#FFFFFF"
                 onClickAction={() => {
                     console.log("FAB pressed")
                     this.setState({isDialogForNewTokenVisible: true})
                 }}
                 visible={true}
                 iconTextComponent={<><Icon accessibilityHint='Create droplet' name="add-circle" color='#fff'/></>}/>

        </>
            ;
    }

    private async getCurrentTokens() {
        const currentUser = auth().currentUser;

        if (!this.checkForLogin() || !currentUser) {
            throw new Error('Failed to get current user');
        }

        // Listen for changes on the Firestore
        // and as soon as tokens are added or removed from this user's "key"
        // refresh the UI and show them
        firestore()
            .collection('digitalocean_tokens')
            .doc(currentUser.uid)
            .collection("tokens")
            .onSnapshot(snapshot => {
                if (!snapshot) {
                    this.setState({
                        accounts: [],
                    });
                    return;
                }
                const accounts: Token[] = [];
                snapshot.forEach(item => {
                    const obj: Token = {
                        alias: item.ref.id,
                        token: String(item.get('token')),
                    };
                    if (item.get('created_at')) {
                        obj.created_at = Number(item.get('created_at'));
                    }
                    accounts.push(obj);
                    this.setState({
                        accounts,
                    });
                });
                console.log('New DO accounts list received and set in UI:', JSON.stringify(accounts.length, null, 2));
            }, error => {
                console.log(error);
                this.setState({
                    accounts: [{
                        alias: "INTERNAL_ERROR",
                        token: "",
                    }],
                });
            });
    }

    async componentDidMount(): Promise<any> {
        if (this.checkForLogin()) {
            await this.getCurrentTokens();
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
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});