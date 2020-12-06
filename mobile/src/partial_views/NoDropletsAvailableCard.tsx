import React from "react";
import {Button, Icon} from "react-native-elements";
import {StyleSheet, View} from "react-native";
import {Title} from 'react-native-paper';


export class NoDropletsAvailableCard extends React.PureComponent<{
    onClickCreateDroplet: Function,
    onClickSwitchAccounts: Function,
}> {

    render() {
        return <View style={styles.container}>
            <Icon
                size={60}
                type={"material"}
                name='sentiment-dissatisfied'/>
            <Title
                style={styles.text}
            >
                No droplets available in this DigitalOcean account.
            </Title>
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
        marginHorizontal: 25,
        marginVertical: 20,
    }
})
