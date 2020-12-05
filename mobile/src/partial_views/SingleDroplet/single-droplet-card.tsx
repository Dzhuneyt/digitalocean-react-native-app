import React from "react";
import {StyleSheet, Text, View} from "react-native";
import TimeAgo from 'react-native-timeago';
import {Button, Card, Icon} from "react-native-elements";
import {Droplet} from "../../interfaces/Droplet";
import {getIpV4, humanFriendlySize} from "./util";

export class SingleDropletCard extends React.Component<{
    droplet: Droplet,
}, any> {
    state = {expanded: false};

    private interval: any;

    render() {
        return <Card>
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
                        style={{marginLeft: 10}}>{this.props.droplet.name} ({humanFriendlySize(this.props.droplet.memory * 1024 * 1024)}, {this.props.droplet.region.slug.toUpperCase()})</Text>
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
                        name={this.state.expanded ? 'arrow-circle-o-up' : 'arrow-circle-o-down'}
                        color='#aaa'
                    />
                </View>
            </View>


            <View style={[{
                flex: 1,
                flexDirection: 'column',
                paddingTop: 10,
            },
                this.state.expanded ? {display: 'flex'} : {display: 'none'}
            ]}>
                <Text style={styles.dropletInfo}>
                    RAM: {humanFriendlySize(this.props.droplet.memory * 1024 * 1024)}
                </Text>

                <Text style={styles.dropletInfo}>
                    Disk: {this.props.droplet.disk} GB
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

                <View style={[{
                    flex: 1,
                    flexDirection: 'column',
                    paddingTop: 10,
                }]}>
                    <Button
                        icon={<Icon
                            style={{
                                alignSelf: 'flex-end'
                            }}
                            type='font-awesome'
                            name={'refresh'}
                            color='#fff'
                            containerStyle={{
                                marginRight: 10,
                            }}
                            accessibilityLabel={'Restart'}
                        />}
                        title={'Restart'}
                    >
                    </Button>

                    <View style={{height: 10}}/>

                    <Button
                        icon={<Icon
                            style={{
                                alignSelf: 'flex-end'
                            }}
                            type='font-awesome'
                            name={'stop'}
                            color='#fff'
                            containerStyle={{
                                marginRight: 10
                            }}
                            accessibilityLabel={'Shut down'}
                        />}
                        title={'Shut down'}
                    >
                    </Button>
                </View>

            </View>
        </Card>
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
