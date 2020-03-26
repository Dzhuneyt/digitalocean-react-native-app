import React, {Component} from "react";
import {Linking, Text} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Card, Icon, Input} from "react-native-elements";
import Snackbar from "react-native-snackbar";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

export class ConfigureDigitalOceanToken extends Component<{
    // Props
    navigation: any
}, {
    // State
    token: string
}> {

    state = {token: ''};

    async saveToken() {
        console.log(this.state.token);

        const uid = auth().currentUser?.uid;
        const collection = firestore()
            .collection('digitalocean_tokens');
        await collection.doc(uid).set({
            token: this.state.token,
        });

        this.props.navigation.replace("Droplets", {name: 'Droplets'});
    }

    openCreateTokenWebpage() {
        const url = 'https://cloud.digitalocean.com/account/api/tokens/new';
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    render() {
        return <>
            <Card>
                <Text style={{textAlign: 'center'}}>Please enter your DigitalOcean API token below</Text>
                <Input
                    value={this.state.token}
                    leftIcon={<Icon
                        type='font-awesome'
                        name='lock'
                        color='#aaa'
                        style={{
                            marginRight: 10
                        }}
                    />}
                    secureTextEntry
                    onChangeText={text => this.setState({token: text})}
                    placeholder='API Token'
                    containerStyle={{
                        marginTop: 10,
                        marginBottom: 10,
                    }}
                />
                <Button
                    title="Save"
                    onPress={() => this.saveToken()}
                />

                <Button
                    containerStyle={{
                        marginTop: 20
                    }}
                    buttonStyle={{
                        backgroundColor: '#aaa'
                    }}
                    title="Create an API token"
                    onPress={() => this.openCreateTokenWebpage()}
                />

            </Card>
        </>
            ;
    }

    async componentDidMount(): Promise<any> {
        if (!auth().currentUser) {
            this.props.navigation.replace("Login", {name: 'Login'});
            return false;
        }

        // AsyncStorage.getItem('digitalocean_token').then(value => {
        //     if (value) {
        //         this.props.navigation.replace("Droplets", {name: 'Droplets'});
        //     }
        // });

        const currentToken = await this.getCurrentDigitaloceanToken();
        this.setState({
            token: currentToken,
        })
    }

    async getCurrentDigitaloceanToken() {
        if (!auth().currentUser) {
            return false;
        }
        // Get the users ID
        const uid = auth().currentUser?.uid;

        // Read the document for user 'Ada Lovelace':
        const documentSnapshot = await firestore()
            .collection('digitalocean_tokens')
            .doc(uid)
            .get();

        return documentSnapshot ? documentSnapshot.get('token') : false;
    }
}
