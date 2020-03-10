import React from "react";
import {FlatList, StatusBar, Text, View} from "react-native";
import {DropletsSingle} from "../partial_views/droplets-single";
import AsyncStorage from "@react-native-community/async-storage";
import {DigitalOceanService} from "../services/digital-ocean.service";

const digitalOceanService = new DigitalOceanService();

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
                    keyExtractor={(item: any) => String(item.id)}
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
        const droplets = await digitalOceanService.getDroplets();
        this.setState({
            droplets: droplets.sort((a: any, b: any) => {
                return a.created_at - b.created_at;
            }).reverse(),
        });
        console.log('Droplets refreshed');
        this.setState({
            refreshing: false,
        });
    }

    async componentDidMount(): Promise<void> {

        AsyncStorage.getItem('digitalocean_token').then(value => {
            if (!value) {
                this.props.navigation.replace('Login' as any, {name: 'Login'} as any);
            } else {
                this.refresh().then(value1 => {
                });
            }
        })
    }
}
