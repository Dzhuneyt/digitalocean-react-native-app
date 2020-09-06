import React from "react";
import {FlatList, Text, View} from "react-native";
import RNRestart from "react-native-restart";
import {Button, Overlay, SearchBar} from 'react-native-elements';
import {DigitalOceanDropletsService} from "../../services/DigitalOceanDropletsService";
import auth from '@react-native-firebase/auth';
import {getAlias} from "../../helpers/digitalocean";
import {DropletCreate} from "./DropletCreate";
import {SingleDropletCard} from "../../partial_views/single-droplet-card";
import {NoDropletsAvailableCard} from "../../partial_views/NoDropletsAvailableCard";
import {IDroplet} from "dots-wrapper/dist/modules/droplet";
import {StackNavigationProp} from "@react-navigation/stack";

const logout = async () => {
    await auth().signOut();
    RNRestart.Restart()
};

export class DropletList extends React.Component<{
    route: any,
    navigation: StackNavigationProp<any>,
}, {
    droplets: IDroplet[],
    refreshing: boolean,
    createDropletDialogVisible: boolean,
    currentApiToken?: string,
    search: string,
}> {
    state = {
        droplets: [],
        refreshing: false,
        createDropletDialogVisible: false,
        currentApiToken: '',
        search: '',
    };

    private _intervalForRefreshingUI: any;

    renderSearchHeader = () => {
        return <SearchBar
            onChangeText={(search) => this.setState({search: search})}
            placeholder="Type Here..."
            value={this.state.search}
            lightTheme
            round
        />;
    };

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
                    data={this.getDroplets()}
                    keyExtractor={(item: any) => String(item.id)}
                    renderItem={({item}) => <SingleDropletCard {...item}/>}
                    ListEmptyComponent={NoDropletsAvailableCard}
                    ListHeaderComponent={this.renderSearchHeader}
                />
            </View>
        </>;
    }

    getDroplets() {
        if (this.state.search.length) {
            return this.state
                .droplets
                .filter(
                    (droplet: IDroplet) => droplet.name.includes(this.state.search)
                );
        }
        return this.state.droplets;
    }

    /**
     * Refresh the list of droplets from DigitalOcean API
     * @param showSpinner indicate with a visual spinner
     */
    async refresh(showSpinner = true) {
        if (showSpinner) {
            this.toggleSpinner(true);
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
        } catch (e) {
            console.log('Droplets failed to refresh');
            console.log(JSON.stringify(e));
        }

        this.toggleSpinner(false);
    }

    private toggleSpinner(show: boolean) {
        this.setState({
            refreshing: show,
        });
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
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >Manage accounts</Text>
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
