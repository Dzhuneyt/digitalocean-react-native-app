import React from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import RNRestart from "react-native-restart";
import {Header, Icon, Overlay} from 'react-native-elements';
import {DigitalOceanDropletsService} from "../../services/DigitalOceanDropletsService";
import auth from '@react-native-firebase/auth';
import {getAlias} from "../../helpers/digitalocean";
import {DropletCreate} from "./DropletCreate";
import {SingleDropletCard} from "../../partial_views/SingleDroplet/single-droplet-card";
import {NoDropletsAvailableCard} from "../../partial_views/NoDropletsAvailableCard";
import {IDroplet} from "dots-wrapper/dist/modules/droplet";
import {StackNavigationProp} from "@react-navigation/stack";
import ActionButton from "react-native-action-button";
import Snackbar from "react-native-snackbar";

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
}> {
    state = {
        droplets: [],
        refreshing: true,
        createDropletDialogVisible: false,
        currentApiToken: '',
    };

    private _intervalForRefreshingUI: any;

    render() {
        return <>
            <View style={{flex: 1}}>
                <Header
                    statusBarProps={{translucent: true}}
                    placement="left"
                    leftComponent={{
                        icon: 'menu', color: '#fff', onPress: () => {
                            alert('bla')
                        }
                    }}
                    centerComponent={{text: 'DigitalOcean - Droplets', style: {color: '#fff'}}}
                    rightComponent={{icon: 'home', color: '#fff'}}
                />
                <Overlay
                    fullScreen={false}
                    isVisible={this.state.createDropletDialogVisible}
                    onBackdropPress={() => this.setState({createDropletDialogVisible: false})}
                >
                    <DropletCreate
                        currentApiToken={this.state.currentApiToken}
                        onCreate={() => {
                            this.setState({createDropletDialogVisible: false});
                            Snackbar.show({
                                text: "Droplet creation started. Check back in a minute...",
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: "green"
                            });
                        }}
                    />
                </Overlay>
                <FlatList
                    onRefresh={() => this.refresh()}
                    refreshing={this.state.refreshing}
                    data={this.getDroplets()}
                    keyExtractor={(item: any) => String(item.id)}
                    renderItem={({item}) => <SingleDropletCard {...item}/>}
                    ListEmptyComponent={<NoDropletsAvailableCard
                        shown={!this.state.refreshing}
                        onClickCreateDroplet={() => this.setState({
                            createDropletDialogVisible: true,
                        })}
                        onClickSwitchAccounts={() => {
                            // @TODO redirect to accounts listing screen
                        }}
                    />}
                />

                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item
                        buttonColor="#9b59b6"
                        title="Create a droplet"
                        onPress={() => this.setState({createDropletDialogVisible: true})}>
                        <Icon color='#fff' name="add-circle" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor="#3498db"
                        title="Switch Accounts"
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon color='#fff' name="people" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                </ActionButton>
            </View>
        </>;
    }

    getDroplets() {
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
            currentApiToken: String(alias.get('token')),
        });
        await this.refresh(true);

        // Refresh the droplet list every 10 seconds
        this._intervalForRefreshingUI = setInterval(async () => {
            await this.refresh(false);
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this._intervalForRefreshingUI);
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
