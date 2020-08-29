import React from "react";
import {StyleSheet, Text, View} from "react-native";
import TimeAgo from 'react-native-timeago';
import {Card, Icon} from "react-native-elements";
import {Droplet} from "../interfaces/Droplet";

function getIpV4(networks: any) {
    const ips: any[] = [];
    if (!networks.hasOwnProperty('v4')) {
        return "";
    }
    networks.v4.forEach((network: any) => {
        ips.push(network.ip_address);
    });
    return ips.join(", ");
}

const humanFriendlySize = function (bytes: number) {
    if (bytes == 0) {
        return "0.00 B";
    }
    const e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(0) + '' + ' KMGTP'.charAt(e) + 'B';
};

export class SingleDropletCard extends React.Component<Droplet, any> {
    state = {expanded: false};

    private interval: any;

    render() {
        return (
            <>
                <Card>
                    <View style={{
                        flex: 1,
                        flexDirection: "row"
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                            {this.props.status === "new" && <Icon
                                type='font-awesome'
                                name='spinner'
                                color='grey'/>}
                            {this.props.status === "active" && <Icon
                                type='material'
                                name='cloud'
                                color='#009688'/>}
                            {this.props.status === "off" && <Icon
                                type='material'
                                name='cloud-off'
                                color='#FF1744'/>}
                            <Text
                                style={{marginLeft: 10}}>{this.props.name} ({humanFriendlySize(this.props.memory * 1024 * 1024)}, {this.props.region.slug.toUpperCase()})</Text>
                        </View>

                        <View>
                            <Icon
                                onPress={() => {
                                    this.setState({expanded: !this.state.expanded})
                                }}
                                style={{
                                    alignSelf: 'flex-end'
                                }}
                                type='font-awesome'
                                name={this.state.expanded ? 'chevron-circle-up' : 'chevron-circle-down'}
                                color='#aaa'
                            />
                        </View>
                    </View>


                    <View style={[{
                        flex: 1, flexDirection: 'column',
                        paddingTop: 10,
                    },
                        this.state.expanded ? {display: 'flex'} : {display: 'none'}
                    ]}>
                        <Text style={styles.dropletInfo}>
                            RAM: {humanFriendlySize(this.props.memory * 1024 * 1024)}
                        </Text>

                        <Text style={styles.dropletInfo}>
                            Disk: {this.props.disk} GB
                        </Text>

                        <Text style={styles.dropletInfo}>
                            Region: {this.props.region.name}
                        </Text>

                        <Text style={styles.dropletInfo}>
                            IP: {getIpV4(this.props.networks)}
                        </Text>

                        <Text style={styles.dropletInfo}>
                            Image: {this.props.image.distribution} {this.props.image.name}
                        </Text>

                        <Text style={styles.dropletInfo}>
                            Created: <TimeAgo time={this.props.created_at}/>
                        </Text>

                    </View>
                </Card>

            </>
        );
    }

    componentDidMount() {
        // Refresh the UI of the card every 3 seconds
        this.interval = setInterval(() => this.setState({time: Date.now()}), 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}

const styles = StyleSheet.create({
    dropletInfo: {
        color: '#666',
        paddingBottom: 5,
        paddingTop: 5,
    }
});
