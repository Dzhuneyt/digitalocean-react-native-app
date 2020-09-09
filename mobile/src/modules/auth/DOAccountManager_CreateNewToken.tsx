import React from "react";
import {Divider, Icon, Text} from "react-native-elements";
import {Button, Card, Input} from "react-native-elements";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {Linking} from "react-native";
import {Token} from "../../interfaces/Token";

interface State extends Token {
    tutorialAcknowledged: boolean,
}

/**
 * Dialog to add a single DO API token to the list of accounts
 */
export class DOAccountManager_CreateNewToken extends React.Component<any, any> {
    state: State = {
        token: '',
        alias: '',
        tutorialAcknowledged: false,
    };

    render(): React.ReactNode {
        return <>
            <Text h4 style={{marginBottom: 15, textAlign: 'center'}}>Create a new API key</Text>

            <Text style={{textAlign: 'center', marginBottom: 15}}>The app uses an API key instead of a username and
                password to communicate with your DigitalOcean account.
            </Text>
            <Text style={{textAlign: 'center', marginBottom: 15}}>
                API keys are much more secure than traditional username/password authentication in a sense that they are
                pseudo-random (unlike your password, which you never reuse on more than one site right?).
            </Text>

            <Text style={{textAlign: 'center', marginBottom: 15}}> Additionally, you can always revoke an API key from
                your DigitalOcean account settings page.</Text>

            <Button
                containerStyle={{
                    marginTop: 0
                }}
                buttonStyle={{
                    backgroundColor: '#aaaaaa'
                }}
                title="Where to I get a new API token?"
                onPress={() => this.openCreateTokenUrl()}
            />

            {!this.state.tutorialAcknowledged && <Button
                containerStyle={{
                    marginTop: 10
                }}
                buttonStyle={{
                    backgroundColor: '#2196f3'
                }}
                title="Get Started"
                onPress={() => this.setState({tutorialAcknowledged: true})}
            />}

            {this.state.tutorialAcknowledged && <>
                <Input
                    value={this.state.alias}
                    label={'Name'}
                    onChangeText={text => this.setState({alias: text})}
                    placeholder='E.g. "servers of my company"'
                    containerStyle={{
                        marginTop: 10,
                        marginBottom: 10,
                    }}
                />
                <Input
                    value={this.state.token}
                    secureTextEntry
                    label={'API Key'}
                    onChangeText={text => this.setState({token: text})}
                    placeholder='e.g. gPjh4GxMule4pdRd'
                    containerStyle={{
                        marginTop: 10,
                        marginBottom: 10,
                    }}
                />
                <Button
                    title=" Save" icon={
                    <Icon
                        type='material'
                        name="done"
                        size={15}
                        color={this.state.token && this.state.alias ? '#fff' : '#000'}
                    />
                }
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
            </>}
        </>;
    }

    async saveToken(tokenData: Token) {
        console.log('Saving new token', tokenData);

        const currentUser = auth().currentUser;

        if (!currentUser) {
            throw new Error('Failed to get current user');
        }

        const userUUID = currentUser.uid;

        const currentUserTokens = await firestore()
            .collection('digitalocean_tokens')
            .doc(userUUID)
            .collection("tokens");

        const currentDocument = await currentUserTokens.doc(tokenData.alias);
        (await currentDocument.set({
            token: tokenData.token,
            created_at: (new Date()).getTime(),
        }))
    }


    openCreateTokenUrl() {
        const url = 'https://cloud.digitalocean.com/account/api/tokens/new';
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }
}
