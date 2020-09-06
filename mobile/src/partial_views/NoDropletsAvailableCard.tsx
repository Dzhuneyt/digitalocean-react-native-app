import React from "react";
import {Text} from "react-native-elements";
import {View} from "react-native";

export class NoDropletsAvailableCard extends React.PureComponent {

    render() {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text>No droplets available for this account</Text>
        </View>;
    }
}