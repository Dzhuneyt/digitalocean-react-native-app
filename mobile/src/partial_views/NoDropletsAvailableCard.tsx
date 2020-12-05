import React from "react";
import {Button, Icon, Text} from "react-native-elements";
import {StyleSheet, View} from "react-native";

export class NoDropletsAvailableCard extends React.PureComponent<{
    onClickCreateDroplet: Function,
    onClickSwitchAccounts: Function,
    shown: boolean,
}> {

    render() {
        if (!this.props.shown) {
            return <></>;
        }
        return <View style={styles.container}>
            <Icon
                size={60}
                type={"material"}
                name='sentiment-dissatisfied'/>
            <Text
                h4
                style={styles.text}>
                No droplets available in this DigitalOcean account.
            </Text>
            <View style={styles.buttonsContainer}>
                <Button
                    title={'Create a droplet'}
                    onPress={() => this.props.onClickCreateDroplet()}/>
                <View style={{height: 10}}/>
                <Button
                    title={'Switch DigitalOcean accounts'}
                    onPress={() => this.props.onClickSwitchAccounts()}/>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "column",
        marginRight: 10,
        marginLeft: 10,
    },
    text: {
        textAlign: 'center',
        margin: 15,
    }
})
