import React from "react";
import {FlatList, StyleSheet, View} from "react-native";
import RNRestart from "react-native-restart";
import {Header, Overlay} from 'react-native-elements';
import {DigitalOceanDropletsService} from "../../services/DigitalOceanDropletsService";
import auth from '@react-native-firebase/auth';
import {getToken} from "../../helpers/digitalocean";
import {DropletCreate} from "./DropletCreate";
import {SingleDropletCard} from "../../partial_views/SingleDroplet/single-droplet-card";
import {NoDropletsAvailableCard} from "../../partial_views/NoDropletsAvailableCard";
import {IDroplet} from "dots-wrapper/dist/modules/droplet";
import {FAB, Snackbar} from 'react-native-paper';

const logout = async () => {
    await auth().signOut();
    RNRestart.Restart()
};

export class DropletList extends React.Component<{
    route: any,
    navigation: any,
}, {
    // Current list of droplets, as retrieved from the API
    droplets: IDroplet[],

    // If the list of droplets is currently refreshing
    refreshing: boolean,
    createDropletDialogIsVisible: boolean,
    currentApiToken?: string,
    snackbarMessage?: string,
}> {
    state = {
        droplets: [],
        refreshing: true,
        createDropletDialogIsVisible: false,
        currentApiToken: '',
        snackbarMessage: undefined
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
                        icon: 'menu',
                        color: '#fff',
                        onPress: () => this.props.navigation.toggleDrawer(),
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
                            this.showMessage("Droplet creation started. Check back in a minute...");
                        }}
                    />
                </Overlay>
                <FlatList
                    // Callback when "pull to refresh" happens in the UI
                    onRefresh={() => this.refresh()}
                    // Flag that tells the component that there is currently an API call in progress
                    // This will show a small spinner on top of the component, as long as this is "true"
                    refreshing={this.state.refreshing}
                    // The data array that's shown in the list
                    data={this.state.droplets}
                    // Utility function that tells the component how to identity the uniqueness
                    // of every item in the list. In other words, where the ID of each item is located
                    keyExtractor={(item: any) => String(item.id)}
                    // Component that visualizes a single item in the list
                    renderItem={({item}) => <SingleDropletCard
                        droplet={item}
                        dropletsService={this.dropletsService}
                    />}
                    // Render this component when the list is empty
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
                <FAB
                    focusable={true}
                    accessibilityValue={null}
                    style={styles.fab}
                    visible={true}
                    label={"Create a droplet"}
                    icon="plus"
                    onPress={() => this.setState({
                        createDropletDialogIsVisible: true,
                    })}
                />

                <Snackbar
                    duration={5000}
                    onDismiss={() => this.setState({snackbarMessage: undefined})}
                    visible={!!this.state.snackbarMessage}>
                    {this.state.snackbarMessage}</Snackbar>
            </View>
        </>;
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

    private showMessage(message: string) {
        this.setState({
            snackbarMessage: message,
        });
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
