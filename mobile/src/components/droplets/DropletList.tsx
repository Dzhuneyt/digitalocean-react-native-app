import React from "react";
import {FlatList, Text, View} from "react-native";
import {DropletsSingle} from "../../partial_views/droplets-single";
import RNRestart from "react-native-restart";
import {Overlay} from 'react-native-elements';
import {DropletCreate} from "./droplet-create";
import {DigitalOceanDropletsService} from "../../services/digitalOceanDropletsService";
import auth from '@react-native-firebase/auth';
import {getAlias} from "../../helpers/digitalocean";


const logout = async () => {
    await auth().signOut();
    // AsyncStorage.removeItem('digitalocean_token').then(value => {
    RNRestart.Restart()
    // });
};
const createDroplet = () => {
    console.log('Creating droplet');
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
        const dropletsService = new DigitalOceanDropletsService(this.state.currentApiToken);

        try {
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
        } catch (e) {
            console.log('Droplets failed to refresh');
            console.log(JSON.stringify(e));
            this.setState({
                refreshing: false,
            });
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
        //
        // dropletsService.getCurrentDigitaloceanToken().then(value => {
        //     if (!value) {
        //         this.props.navigation.replace('Login' as any, {name: 'Login'} as any);
        //         return;
        //     } else {
        //         this.refresh().then();
        //     }
        // });
    }


}
