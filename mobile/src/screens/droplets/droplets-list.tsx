import React from "react";
import {Button, FlatList, StatusBar, Text, View} from "react-native";
import {DropletsSingle} from "../../partial_views/droplets-single";
import AsyncStorage from "@react-native-community/async-storage";
import RNRestart from "react-native-restart";
import {Overlay} from 'react-native-elements';
import {DropletCreate} from "./droplet-create";
import {DigitalOceanDropletsService} from "../../services/digitalOceanDropletsService";

const dropletsService = new DigitalOceanDropletsService();

const logout = () => {
    AsyncStorage.removeItem('digitalocean_token').then(value => {
        RNRestart.Restart()
    });
};
const createDroplet = () => {
    console.log('Creating droplet');
};

export class DropletsList extends React.Component<any, any> {
    state = {
        droplets: [],
        refreshing: false,
        createDropletDialogVisible: false,
    };

    render() {
        return <>
            <View style={{flex: 1}}>
                <Overlay
                    fullScreen={true}
                    isVisible={this.state.createDropletDialogVisible}
                    onBackdropPress={() => this.setState({createDropletDialogVisible: false})}
                >
                    <DropletCreate/>
                </Overlay>
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
        const droplets = await dropletsService.getDroplets();
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
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    alignContent: "center",
                    alignSelf: "center"
                }}>
                    <Text
                        style={{
                            marginRight: 10,
                            alignSelf: 'center'
                        }}
                        onPress={() => this.setState({createDropletDialogVisible: true})}
                    >Create new droplet</Text>
                    <Text
                        style={{
                            marginRight: 10,
                            alignSelf: 'center'
                        }}
                        onPress={() => logout()}
                    >Logout</Text>
                </View>
            ),
        });

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
