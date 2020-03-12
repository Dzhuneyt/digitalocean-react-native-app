import {Component} from "react";
import React from "react";
import {ScrollView, StyleSheet, Picker} from "react-native";
import {Button, Input} from 'react-native-elements';
import {DigitalOceanService} from "../services/digital-ocean.service";

const digitalOceanService = new DigitalOceanService();

export class DropletCreate extends Component {
    render() {
        return <>
            <ScrollView>
                <Input
                    containerStyle={styles.input}
                    placeholder='Hostname (droplet name)'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='Region'
                />
                <Picker
                    style={{
                        marginLeft: 5
                    }}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({language: itemValue})
                    }>
                    <Picker.Item label="Region" value=""/>
                    <Picker.Item label="JavaScript" value="js"/>
                </Picker>
                <Input
                    containerStyle={styles.input}
                    placeholder='Size'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='Image'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='SSH Keys'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='Backups enabled'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='IP v6'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='Private networking'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='Install DO monitoring agent'
                />
                <Input
                    containerStyle={styles.input}
                    placeholder='Tags'
                />
            </ScrollView>

            <Button
                title="Create droplet"
            />
        </>;
    }

    async componentDidMount() {
        const regions = await digitalOceanService.getRegions();
        console.log(regions);
    }
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        marginBottom: 10,
    }
});