import React from "react";
import {Button, Text} from "react-native-elements";
import {StyleSheet, View} from "react-native";

export class NoDropletsAvailableCard extends React.PureComponent<{
    // Triggered when the "Create droplet" button is clicked
    onClick: Function,
}> {

    render() {
        return <View style={styles.container}>
            <Text style={styles.text}>No droplets available for this account</Text>
            <Button title={'Create a droplet'} onPress={() => this.props.onClick()}/>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    text: {
        fontSize: 22,
        textAlign: "center",
        marginTop: 30,
        marginBottom: 30,
    }
})