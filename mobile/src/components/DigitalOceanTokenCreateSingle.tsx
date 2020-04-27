import React from "react";
import {Text} from "react-native-elements";
import {Button, Card, Input} from "react-native-elements";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {Linking} from "react-native";

export class DigitalOceanTokenCreateSingle extends React.Component<any, any> {
    state = {
        token: '',
        alias: ''
    };

    render(): React.ReactNode {
        return <>
            <Text style={{marginBottom: 20, textAlign: 'center', fontSize: 20}}>Add DigitalOcean account</Text>

            <Input
                value={this.state.alias}
                label={'Account alias or human friendly name'}
                onChangeText={text => this.setState({alias: text})}
                placeholder='My personal DigitalOcean account'
                containerStyle={{
                    marginBottom: 10,
                }}
            />
            <Input
                value={this.state.token}
                secureTextEntry
                label={'Personal Access Token'}
                onChangeText={text => this.setState({token: text})}
                placeholder='API Token'
                containerStyle={{
                    marginTop: 10,
                    marginBottom: 10,
                }}
            />
            <Button
                title="Save"
                onPress={() => {
                    this.saveToken({
                        token: this.state.token,
                        alias: this.state.alias,
                    }).then(value => {
                        console.log('Successfully create DigitalOcean alias');
                        console.log(this.state.alias);
                    })
                }}
                // Disable the Save button until the token is entered
                disabled={!this.state.token || !this.state.alias}
            />

            <Button
                containerStyle={{
                    marginTop: 20
                }}
                buttonStyle={{
                    backgroundColor: '#aaa'
                }}
                title="What are API tokens?"
                onPress={() => this.openTokenInstructionsUrl()}
            />
            <Button
                containerStyle={{
                    marginTop: 20
                }}
                buttonStyle={{
                    backgroundColor: '#aaa'
                }}
                title="Where to I get a new API token?"
                onPress={() => this.openCreateTokenUrl()}
            />
        </>;
    }

    async saveToken(tokenData: {
        token: string,
        alias: string,
    }) {
        console.log(tokenData);

        const currentUser = auth().currentUser;

        if (!currentUser) {
            throw new Error('Failed to get current user');
        }

        const userUUID = currentUser.uid;
        const globalCollectionForTokens = firestore()
            .collection('digitalocean_tokens');

        const currentUserTokens = await globalCollectionForTokens
            .doc(userUUID)
            .collection("tokens");

        const currentDocument = await currentUserTokens.doc(tokenData.alias);
        await currentDocument.set({
            token: tokenData.token,
            created_at: (new Date()).getTime(),
        });
    }


    openCreateTokenUrl() {
        const url = 'https://cloud.digitalocean.com/account/api/tokens/new';
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }

    openTokenInstructionsUrl() {
        const url = 'https://www.digitalocean.com/docs/apis-clis/api/create-personal-access-token/';
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }
}
