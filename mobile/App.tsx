/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar, FlatList,
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import axios from "axios";
import {DigitalOcean} from "./src/digital-ocean";

declare var global: { HermesInternal: null | {} };

const digO = new DigitalOcean();

class App extends React.Component<any, any> {

    state = {
        droplets: []
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <>
                <StatusBar barStyle="default"/>
                <SafeAreaView>
                    <View style={styles.body}>
                        <FlatList
                            data={this.state.droplets}
                            keyExtractor={item=>""+item.id}
                            renderItem={({item}) => <Text>{item.name}</Text>}
                        />
                    </View>
                </SafeAreaView>
            </>
        );
    }

    async componentDidMount(): void {
        const droplets = await digO.getDroplets();
        console.log("Retrieved " + droplets.length + " droplets");
        console.log(droplets)
        this.setState({
            droplets: droplets,
        });
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default App;
