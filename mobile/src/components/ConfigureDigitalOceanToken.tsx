import React from "react";
import {FlatList, Text, TouchableHighlight} from "react-native";
import {Button, Card, Overlay} from "react-native-elements";
import auth from '@react-native-firebase/auth';
import {DigitalOceanTokenCreateSingle} from "./DigitalOceanTokenCreateSingle";
import firestore from "@react-native-firebase/firestore";
import {getAlias} from "../helpers/digitalocean";

interface DigitalOceanToken {
    alias: string;
    token?: string;
    created_at?: number;
}

export class ConfigureDigitalOceanToken extends React.Component<{
    // Props
    navigation: any
}, {
    isCreating: boolean,
    droplets: DigitalOceanToken[],
}> {

    state = {
        isCreating: false,
        droplets: [
            {id: "123", alias: "Default", token: "abc"},
            {id: "124", alias: "Work", token: "ccc"},
        ],
    };


    render() {
        return <>
            <Overlay
                fullScreen={false}
                isVisible={this.state.isCreating}
                onBackdropPress={() => this.setState({
                    isCreating: false,
                })}
            >
                <DigitalOceanTokenCreateSingle/>
            </Overlay>
            <Card>
                <Text style={{textAlign: 'left', marginBottom: 10}}>Please configure your DigitalOcean Personal Access
                    Token
                    below.</Text>
                <Text style={{textAlign: 'left', marginBottom: 10}}>It serves as a replacement for your username and
                    password and allows
                    this app to interact
                    with resources in your DigitalOcean account (e.g. create droplets).</Text>

                <Button
                    containerStyle={{
                        marginTop: 20
                    }}
                    title="Create a new token"
                    onPress={() => this.setState({isCreating: true})}
                />
            </Card>

            <FlatList
                data={this.state.droplets}
                keyExtractor={(item: DigitalOceanToken) => String(item.alias)}
                renderItem={({item}) => <>
                    <Card>
                        <TouchableHighlight onPress={() => this.goToDropletListingForAlias(item.alias)}>
                            <Text>{item.alias}</Text>
                        </TouchableHighlight>
                    </Card>
                </>}
            />
        </>
            ;
    }

    private async getCurrentTokens() {
        const currentUser = auth().currentUser;

        if (!currentUser) {
            throw new Error('Failed to get current user');
        }

        const userUUID = currentUser.uid;
        const globalCollectionForTokens = firestore()
            .collection('digitalocean_tokens');

        // Listen for changes on the Firestore and update the list in the UI
        const currentUserTokens = globalCollectionForTokens
            .doc(userUUID)
            .collection("tokens")
            .onSnapshot(snapshot => {
                if (!snapshot) {
                    this.setState({
                        droplets: [],
                    });
                    return;
                }
                const droplets: DigitalOceanToken[] = [];
                snapshot.forEach(item => {
                    const obj: DigitalOceanToken = {
                        alias: item.ref.id,
                        token: item.get('token'),
                    };
                    if (item.get('created_at')) {
                        obj.created_at = item.get('created_at');
                    }
                    droplets.push(obj);
                    this.setState({
                        droplets,
                    });
                });
                console.log(droplets);
            }, error => {
                console.log(error);
            });
    }

    async componentDidMount(): Promise<any> {
        // If not logged in, redirect to login page
        if (!auth().currentUser) {
            this.props.navigation.replace("Login", {name: 'Login'});
            return false;
        }
        await this.getCurrentTokens();
    }

    async goToDropletListingForAlias(alias: string) {
        const doc = await getAlias(alias);
        this.props.navigation.navigate("Droplets", {
            alias: doc.ref.id,
        });
    }

    // async getCurrentDigitaloceanToken() {
    //     if (!auth().currentUser) {
    //         return false;
    //     }
    //     // Get the users ID
    //     const uid = auth().currentUser?.uid;
    //
    //     // Read the document for user 'Ada Lovelace':
    //     const documentSnapshot = await firestore()
    //         .collection('digitalocean_tokens')
    //         .doc(uid)
    //         .get();
    //
    //     return documentSnapshot ? documentSnapshot.get('token') : false;
    // }
}
