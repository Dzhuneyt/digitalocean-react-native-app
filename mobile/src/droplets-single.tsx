import React, {RefObject} from "react";
import {Text, View} from "react-native";
import TimeAgo from 'react-native-timeago';
import Circle from "./circle";
import {Icon} from "react-native-elements";

interface SingleDroplet {
    // @see https://developers.digitalocean.com/documentation/v2/#list-all-droplets for all possible value
    id: number;
    name: string;
    networks: {};
    created_at: string;
    status: "new" | "active" | "off" | "archive";
}

function getIpV4(networks: Object) {
    const ips: any[] = [];
    if (!networks.hasOwnProperty('v4')) {
        return "";
    }
    networks.v4.forEach((network: any) => {
        ips.push(network.ip_address);
    });
    return ips.join(", ");
}

export class DropletsSingle extends React.Component<SingleDroplet, SingleDroplet> {
    props: SingleDroplet;

    render() {
        let dropletColor = "red";

        switch (this.props.status) {
            case "active":
                dropletColor = "green";
                break;
            case "new":
                dropletColor = "grey";
                break;
            case "off":
                dropletColor = "red";
                break;
            case "archive":
                dropletColor = "grey";
                break;
        }
        return (
            <>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    padding: 10,
                    alignItems: 'center'
                }}>
                    {this.props.status === "new" && <Icon
                        type='font-awesome'
                        name='spinner'
                        color='grey'/>}
                    {this.props.status === "active" && <Icon
                        type='font-awesome'
                        name='power-off'
                        color='green'/>}
                    {this.props.status === "off" && <Icon
                        type='font-awesome'
                        name='power-off'
                        color='#000'/>}
                    <Text style={{marginLeft: 10}}>{this.props.name}</Text>
                </View>

                <View style={{
                    flex: 1, flexDirection: 'column', justifyContent: 'flex-start',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                }}>
                    <Text style={{color: '#666'}}>
                        Created <TimeAgo time={this.props.created_at}/>
                    </Text>
                    <Text style={{color: '#666'}}>
                        IP: {getIpV4(this.props.networks)}
                    </Text>
                    {/*<Text>{JSON.stringify(this.props)}</Text>*/}
                </View>
            </>
        );
    }

    componentDidMount(): void {
    }
}