import React from "react";
import {Text} from "react-native";
import {Button, Card} from "react-native-elements";

/**
 * @TODO Implement this fully and embed it
 */
export class DOAccountManager_CreateNewTokenInformativeCard extends React.PureComponent {
    render() {
        return <>
            <Card>
                <Text style={{textAlign: 'left', marginBottom: 10}}>Please configure your DigitalOcean Personal Access
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
}