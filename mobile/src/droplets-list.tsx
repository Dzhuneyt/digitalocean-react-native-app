import React from "react";
import {FlatList, StatusBar, Text, View} from "react-native";
import {DigitalOcean} from "./digital-ocean";
import {DropletsSingle} from "./droplets-single";
import {Divider} from 'react-native-elements';

const digO = new DigitalOcean();

export class DropletsList extends React.Component<any, any> {
    state = {
        droplets: []
    };

    render() {
        return <>
            <View style={{flex: 1}}>
                <FlatList
                    data={this.state.droplets}
                    keyExtractor={item => "" + item.id}
                    ItemSeparatorComponent={Divider}
                    renderItem={({item}) => <DropletsSingle {...item}/>}
                />
            </View>
        </>;
    }

    async componentDidMount(): void {
        const droplets = await digO.getDroplets();
        this.setState({
            droplets: droplets.sort((a, b) => {
                return a.created_at - b.created_at;
            }).reverse(),
        });
    }
}