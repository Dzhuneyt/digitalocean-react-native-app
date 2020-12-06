import React from "react";
import {FlatList, StyleSheet, View} from "react-native";
import RNRestart from "react-native-restart";
import {Header, Icon, Overlay} from 'react-native-elements';
import {DigitalOceanDropletsService} from "../../services/DigitalOceanDropletsService";
import auth from '@react-native-firebase/auth';
import {getToken} from "../../helpers/digitalocean";
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
    // Current list of droplets, as retrieved from the API
    droplets: IDroplet[],

    // If the list of droplets is currently refreshing
    refreshing: boolean,
    createDropletDialogIsVisible: boolean,
    currentApiToken?: string,
}> {
    state = {
        droplets: [],
        refreshing: true,
        createDropletDialogIsVisible: false,
        currentApiToken: '',
    };

    private _intervalForRefreshingDropletList: NodeJS.Timeout | undefined;
    private dropletsService!: DigitalOceanDropletsService;

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
                    isVisible={this.state.createDropletDialogIsVisible}
                    onBackdropPress={() => this.setState({createDropletDialogIsVisible: false})}
                >
                    <DropletCreate
                        currentApiToken={this.state.currentApiToken}
                        onCreate={() => {
                            this.setState({createDropletDialogIsVisible: false});
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
                    renderItem={({item}) => <SingleDropletCard
                        droplet={item}
                        dropletsService={this.dropletsService}
                    />}
                    ListEmptyComponent={!this.state.refreshing ? <NoDropletsAvailableCard
                        // Open "create new droplet" dialog
                        onClickCreateDroplet={() => this.setState({
                            createDropletDialogIsVisible: true,
                        })}
                        // Go back to DO account listing screen
                        onClickSwitchAccounts={() => {
                            this.props.navigation.goBack();
                        }}
                    /> : <></>}
                />

                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item
                        buttonColor="#9b59b6"
                        title="Create a droplet"
                        onPress={() => this.setState({createDropletDialogIsVisible: true})}>
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
        this.dropletsService = new DigitalOceanDropletsService(this.state.currentApiToken);

        try {
            const droplets = await this.dropletsService.getDroplets();
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
        if (!this.props.route.params['alias']) {
            throw new Error('Attempted to list droplets but no DigitalOcean account provided');
        }

        const alias = await getToken(this.props.route.params['alias']);
        this.setState({
            currentApiToken: String(alias.get('token')),
        });
        this.dropletsService = new DigitalOceanDropletsService(this.state.currentApiToken);

        await this.refresh(true);

        // Refresh the droplet list every 10 seconds
        this._intervalForRefreshingDropletList = setInterval(async () => {
            await this.refresh(false);
        }, 10000);
    }

    componentWillUnmount() {
        if (this._intervalForRefreshingDropletList) {
            clearInterval(this._intervalForRefreshingDropletList);
        }
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
