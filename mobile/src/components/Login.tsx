import {Component} from "react";
import React from 'react';
import {Button, Input} from "react-native-elements";
import {Text} from "react-native";
import auth from "@react-native-firebase/auth";
import Snackbar from "react-native-snackbar";

export class Login extends Component<any, any> {
    state = {
        username: '',
        password: '',
    };

    render() {
        return <>
            <Input label="Username" onChangeText={text => this.setState({username: text})}
            />

            <Input label="Password" onChangeText={text => this.setState({password: text})}
            />

            <Button
                title="Signin"
                onPress={() => this.login()}
            />
        </>
    }

    componentDidMount(): void {
        if (auth().currentUser) {
            this.props.navigation.replace("ConfigureDigitalOceanToken", {name: 'DigitalOcean API Token'});
        }
    }

    /**
     * Do the actual API call to login and redirect to
     */
    async login() {
        try {
            await auth().signInWithEmailAndPassword(this.state.username, this.state.password);
            console.log('logged in');
            Snackbar.show({
                text: 'Successful login',
                duration: Snackbar.LENGTH_SHORT,
            });

            this.props.navigation.replace("ConfigureDigitalOceanToken", {name: 'DigitalOcean API Token'});
        } catch (e) {
            console.log(e.message);
            Snackbar.show({
                text: 'Invalid credentials',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    }
}
