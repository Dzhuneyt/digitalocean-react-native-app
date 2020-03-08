import React from "react";
import {StyleSheet, View} from "react-native";

class Circle extends React.Component<any, any> {

    getStyle() {
        const size = this.props.size ? this.props.size : 100;
        return StyleSheet.flatten({
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: this.props.color ? this.props.color : 'red',
        });
    }

    render() {
        return (
            <>
                <View style={this.getStyle()}/>
            </>
        );
    }

}

export default Circle;