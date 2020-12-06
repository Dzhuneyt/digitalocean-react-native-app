import React from "react";
import {StyleSheet, Text, View} from "react-native";
import TimeAgo from 'react-native-timeago';
import {Button, Card, Icon} from "react-native-elements";
import {Droplet} from "../../interfaces/Droplet";
import {getIpV4, humanFriendlySize} from "./util";
import {DigitalOceanDropletsService} from "../../services/DigitalOceanDropletsService";
import Snackbar from "react-native-snackbar";

export class SingleDropletCard extends React.Component<{
    droplet: Droplet,
    dropletsService: DigitalOceanDropletsService,
}, any> {
    state = {
        // Card is expanded or not. Show droplet details on expand
        expanded: false,
    };

    render() {
        const getStatus = () => {
            switch (this.props.droplet.status) {
                case "new":
                    return "Initializing";
                case "active":
                    return "Active";
                case "off":
                    return "Turned off";
                case "archive":
                    return "Archived";
            }
        };

        return <Card>
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    {this.props.droplet.status === "new" && <Icon
                        type='material'
                        name='cloud-upload'
                        color='grey'/>}
                    {this.props.droplet.status === "active" && <Icon
                        type='material'
                        name='cloud'
                        color='#009688'/>}
                    {this.props.droplet.status === "off" && <Icon
                        type='material'
                        name='cloud-off'
                        color='#FF1744'/>}
                    <Text
                        style={{marginLeft: 10}}>
                        {this.props.droplet.name}&nbsp;
                        ({humanFriendlySize(this.props.droplet.memory * 1024 * 1024)},&nbsp;
                        {this.props.droplet.disk}GB,&nbsp;
                        {this.props.droplet.region.slug.toUpperCase()})
                    </Text>
                </View>

                <View>
                    <Icon
                        onPress={() => this.setState({expanded: !this.state.expanded})}
                        style={styles.expandIcon}
                        type='font-awesome'
                        name={this.state.expanded ? 'arrow-circle-o-up' : 'arrow-circle-o-down'}
                        color='#aaa'
                    />
                </View>
            </View>


            <View style={[styles.expandedContainer,
                // Show or hide this View, based on state variable
                this.state.expanded ? {display: 'flex'} : {display: 'none'}
            ]}>
                <Text style={styles.dropletInfo}>
                    Status: {getStatus()}
                </Text>
                <Text style={styles.dropletInfo}>
                    RAM: {humanFriendlySize(this.props.droplet.memory * 1024 * 1024)}
                </Text>

                <Text style={styles.dropletInfo}>
                    Disk: {this.props.droplet.disk}GB
                </Text>

                <Text style={styles.dropletInfo}>
                    Region: {this.props.droplet.region.name}
                </Text>

                <Text style={styles.dropletInfo}>
                    IP: {getIpV4(this.props.droplet.networks)}
                </Text>

                <Text style={styles.dropletInfo}>
                    Image: {this.props.droplet.image.distribution} {this.props.droplet.image.name}
                </Text>

                <Text style={styles.dropletInfo}>
                    Created: <TimeAgo time={this.props.droplet.created_at}/>
                </Text>


                <View style={styles.cardButtonsContainer}>
                    {this.props.droplet.status === "active" && <><Button
                        icon={<Icon
                            style={styles.cardButtonIcon}
                            type='font-awesome'
                            name={'refresh'}
                            color='#fff'
                            containerStyle={{
                                marginRight: 10,
                            }}
                            accessibilityLabel={'Restart'}
                        />}
                        title={'Restart'}
                        onPress={() => this.restartDroplet(this.props.droplet.id)}
                    > </Button><View style={{height: 10}}/></>}


                    {this.props.droplet.status === "active" && <><Button
                        icon={<Icon
                            style={styles.cardButtonIcon}
                            type='font-awesome'
                            name={'power-off'}
                            color='#fff'
                            containerStyle={{
                                marginRight: 10
                            }}
                            accessibilityLabel={'Shut down'}
                        />}
                        title={'Shut down'}
                        onPress={() => this.shutdownDroplet(this.props.droplet.id)}
                    /><View style={{height: 10}}/></>}

                    {this.props.droplet.status === "off" && <><Button
                        icon={<Icon
                            style={styles.cardButtonIcon}
                            type='font-awesome'
                            name={'power-off'}
                            color='#fff'
                            containerStyle={{
                                marginRight: 10
                            }}
                            accessibilityLabel={'Power on'}
                        />}
                        title={'Power on'}
                        onPress={() => this.powerOnDroplet(this.props.droplet.id)}
                    /><View style={{height: 10}}/></>}

                    {
                        (
                            this.props.droplet.status === "off" ||
                            this.props.droplet.status === "active" ||
                            this.props.droplet.status === "archive"
                        )
                        && <><Button
                            icon={<Icon
                                style={styles.cardButtonIcon}
                                type='font-awesome'
                                name={'trash'}
                                color='#fff'
                                containerStyle={{
                                    marginRight: 10
                                }}
                                accessibilityLabel={'Delete'}
                            />}
                            title={'Delete'}
                            onPress={() => this.deleteDroplet(this.props.droplet.id)}
                        /><View style={{height: 10}}/></>}

                </View>

            </View>
        </Card>
    }

    private restartDroplet(id: number) {
        this.props.dropletsService
            .restartDroplet(id)
            .then(value => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet restart initiated. Please allow up to 1 minute.",
                });
            })
            .catch(reason => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet failed to restart",
                });
            })
    }

    private shutdownDroplet(id: number) {
        this.props.dropletsService
            .shutdownDroplet(id)
            .then(value => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet shutdown initiated. Please allow up to 1 minute.",
                });
            })
            .catch(reason => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet failed to shut down",
                });
            })
    }

    private powerOnDroplet(id: number) {
        this.props.dropletsService
            .powerOnDroplet(id)
            .then(value => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet power on initiated. Please allow up to 1 minute.",
                });
            })
            .catch(reason => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet failed to power on",
                });
            })
    }

    private deleteDroplet(id: number) {
        this.props.dropletsService
            .deleteDroplet(id)
            .then(value => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet delete initiated. Please allow up to 1 minute.",
                });
            })
            .catch(reason => {
                Snackbar.show({
                    duration: 3000,
                    text: "Droplet failed to delete",
                });
            })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row"
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    expandedContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
    },
    expandIcon: {
        alignSelf: 'flex-end'
    },
    dropletInfo: {
        color: '#666',
        paddingBottom: 5,
        paddingTop: 5,
    },
    cardButtonsContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
    },
    cardButtonIcon: {
        alignSelf: 'flex-end'
    },

});
