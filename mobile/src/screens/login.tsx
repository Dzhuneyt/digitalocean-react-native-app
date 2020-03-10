import React, {Component} from "react";
import {Linking, Text} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Card, Icon, Input} from "react-native-elements";

export class Login extends Component<{
    // Props
    navigation: any
}, {
    // State
    token: string
}> {

    state = {token: ''};

    saveToken() {
        console.log(this.state.token);

        AsyncStorage.setItem('digitalocean_token', this.state.token).then(value => {
            this.props.navigation.replace("Droplets", {name: 'Droplets'});
        });
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

            </Card>


            <Button
                containerStyle={{
                    margin: 20
                }}
                buttonStyle={{
                    backgroundColor: '#aaa'
                }}
                title="Create an API token"
                onPress={() => this.openCreateTokenWebpage()}
            />
        </>
            ;
    }

    componentDidMount(): void {
        AsyncStorage.getItem('digitalocean_token').then(value => {
            if (value) {
                this.props.navigation.replace("Droplets", {name: 'Droplets'});
            }
        })
    }
}
