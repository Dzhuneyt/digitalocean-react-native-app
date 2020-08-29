import React from "react";
import {FlatList, Text, View} from "react-native";
import RNRestart from "react-native-restart";
import {Overlay} from 'react-native-elements';
import {DigitalOceanDropletsService} from "../../services/DigitalOceanDropletsService";
import auth from '@react-native-firebase/auth';
import {getAlias} from "../../helpers/digitalocean";
import {DropletCreate} from "./DropletCreate";
import {SingleDropletCard} from "../../partial_views/single-droplet-card";

const logout = async () => {
    await auth().signOut();
    // AsyncStorage.removeItem('digitalocean_token').then(value => {
    RNRestart.Restart()
    // });
};

export class DropletList extends React.Component<{
    route: any,
    navigation: any,
}, {
    droplets: any[],
    refreshing: boolean,
    createDropletDialogVisible: boolean,
    currentApiToken?: string,
}> {
    state = {
        droplets: [],
        refreshing: false,
        createDropletDialogVisible: false,
        currentApiToken: '',
    };

    private _intervalForRefreshingUI: any;

    render() {
        return <>
            <View style={{flex: 1}}>
                <Overlay
                    fullScreen={true}
                    isVisible={this.state.createDropletDialogVisible}
                    onBackdropPress={() => this.setState({createDropletDialogVisible: false})}
                >
                    <DropletCreate currentApiToken={this.state.currentApiToken}/>
                </Overlay>
                <FlatList
                    onRefresh={() => this.refresh()}
                    refreshing={this.state.refreshing}
                    data={this.state.droplets}
                    keyExtractor={(item: any) => String(item.id)}
                    renderItem={({item}) => <SingleDropletCard {...item}/>}
                />
            </View>
        </>;
    }

    async refresh(showInUI = true) {
        if (showInUI) {
            this.setState({
                refreshing: true,
            });
        }

        console.log('Refreshing droplets...');
        const dropletsService = new DigitalOceanDropletsService(this.state.currentApiToken);

        try {
            const droplets = await dropletsService.getDroplets();
            this.setState({
                droplets: droplets.sort((a: any, b: any) => {
                    return a.created_at - b.created_at;
                }).reverse(),
            });
            console.log('Droplets refreshed');
            if (showInUI) {
                this.setState({
                    refreshing: false,
                });
            }
        } catch (e) {
            console.log('Droplets failed to refresh');
            console.log(JSON.stringify(e));
            if (showInUI) {
                this.setState({
                    refreshing: false,
                });
            }
        }

    }

    async componentDidMount(): Promise<void> {
        console.log(this.props.route)
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

        if (!this.props.route.params['alias']) {
            throw new Error('Can not list droplets for unknown DO account');
        }

        const alias = await getAlias(this.props.route.params['alias']);
        console.log(alias);
        this.setState({
            currentApiToken: alias.get('token'),
        });
        await this.refresh();

        // Refresh the droplet list every 10 seconds
        this._intervalForRefreshingUI = setInterval(async () => {
            await this.refresh(false);
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this._intervalForRefreshingUI);
    }
}
