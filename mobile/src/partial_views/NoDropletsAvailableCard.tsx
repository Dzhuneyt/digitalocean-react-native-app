import React from "react";
import {Button, Divider, Icon, Text} from "react-native-elements";
import {StyleSheet, View} from "react-native";

export class NoDropletsAvailableCard extends React.PureComponent<{
    onClick: Function,
    shown: boolean,
}> {

    render() {
        return this.props.shown ? <View style={styles.container}>
            <Icon
                size={80}
                color={"#aaa"}
                type={"material"}
                name='sentiment-dissatisfied'/>
            <Text h4 style={styles.text}>No droplets available in this DigitalOcean account.</Text>
            <Divider/>
            <Text
                style={{
                    ...styles.text
                }}>Try creating some, or switch to a different DigitalOcean account using the
                icons at the bottom right side.</Text>
            <Divider/>
            <Divider/>
        </View> : <></>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
    },
    text: {
        textAlign: 'center',
        margin: 15,
    }
})
