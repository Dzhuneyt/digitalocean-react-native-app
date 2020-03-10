import React from "react";
import {FlatList, StatusBar, Text, View} from "react-native";
import {DigitalOcean} from "./digital-ocean";
import {DropletsSingle} from "./droplets-single";
import {Divider} from 'react-native-elements';

const digO = new DigitalOcean();

export class DropletsList extends React.Component<any, any> {
    state = {
        droplets: [],
        refreshing: false,
    };

    render() {
        return <>
            <View style={{flex: 1}}>
                <FlatList
                    onRefresh={() => this.refresh()}
                    refreshing={this.state.refreshing}
                    data={this.state.droplets}
                    keyExtractor={item => "" + item.id}
                    renderItem={({item}) => <DropletsSingle {...item}/>}
                />
            </View>
        </>;
    }

    async refresh() {
        this.setState({
            refreshing: true,
        });
        console.log('Refreshing droplets...');
        const droplets = await digO.getDroplets();
        this.setState({
            droplets: droplets.sort((a, b) => {
                return a.created_at - b.created_at;
            }).reverse(),
        });
        console.log('Droplets refreshed');
        this.setState({
            refreshing: false,
        });
    }

    async componentDidMount(): void {
        await this.refresh();
    }
}
