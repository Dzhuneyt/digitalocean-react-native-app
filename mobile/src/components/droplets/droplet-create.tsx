import {Component} from "react";
import React from "react";
import {ScrollView, StyleSheet, Picker} from "react-native";
import {Button, Input, Text} from 'react-native-elements';
import {DigitalOceanBaseService} from "../../services/digitalOceanBaseService";
import {ISize} from "dots-wrapper/dist/modules/size";
import {DigitalOceanDropletsService} from "../../services/digitalOceanDropletsService";
import {IRegion} from "dots-wrapper/dist/modules/region";

const digitalOceanService = new DigitalOceanDropletsService();

interface DropletSize {
    slug: string;
}

export class DropletCreate extends Component {
    state: {
        availableRegions: IRegion[],
        availableSizes: ISize[],
        availableImages: ISize[],
        currentRegion: string | null,
        currentSize: ISize | null,
    } = {
        availableRegions: [],
        availableSizes: [],
        availableImages: [],
        currentRegion: null,
        currentSize: null,
    };

    render() {
        let regionsForPicker: any[];

        if (this.state.currentSize) {
            // If droplet size was already selected,
            // allow selecting in the Regions dropdown
            // only the regions allowed for this size
            regionsForPicker = this.state
                .availableRegions
                .filter(value => {
                    // @ts-ignore
                    return this.state.currentSize.regions.find((value1: any) => value1 === value.slug);
                })
                .map((region: any) => {
                    return <Picker.Item label={region.name} key={region.slug} value={region.slug}/>
                });
        } else {
            regionsForPicker = this.state
                .availableRegions
                .map((region: any) => {
                    return <Picker.Item label={region.name} key={region.slug} value={region.slug}/>
                });
        }

        regionsForPicker.unshift(<Picker.Item label="Region" key='' value=''/>);

        let sizesForPicker = this.state.availableSizes.map((size: ISize) => {
            const label = `$ ${size.price_monthly} / mo, ${size.disk} Disk, ${size.vcpus} vCPU, ${size.memory} RAM`;
            return <Picker.Item label={label} key={size.slug} value={size.slug}/>
        });
        sizesForPicker.unshift(<Picker.Item label="Size" key='' value=''/>);

        if (!regionsForPicker.length || !sizesForPicker.length) {
            console.log('No data to populate dropdowns');
            // Do not render anything until we have the necessary information
            return null;
        }
        return <>
            <ScrollView>
                <Input
                    label='Droplet Name'
                    containerStyle={styles.input}
                    placeholder='e.g. ubuntu-2020-03-15'
                />

                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={this.state.currentSize}
                    onValueChange={(itemValue) => {
                        const size = this.state
                            .availableSizes
                            .find(size => size['slug'] === itemValue);
                        this.setState({currentSize: size});
                    }}
                >
                    {sizesForPicker}
                </Picker>

                {this.state.currentSize && <Picker
                    style={styles.picker}
                    selectedValue={this.state.currentRegion}
                    mode="dropdown"
                    onValueChange={(itemValue) => {
                        const foundRegion = this.state
                            .availableRegions
                            .find(region => region['slug'] === itemValue);
                        console.log(itemValue);
                        console.log(foundRegion);
                    }}>
                    {regionsForPicker}
                </Picker>}

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
        this.setState({
            availableRegions: await digitalOceanService.getRegions(),
            availableSizes: await digitalOceanService.getSizes(),
            availableImages: await digitalOceanService.images(),
            // currentRegion: 'nyc1'
        });
    }
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        marginBottom: 10,
    },
    picker: {
        marginLeft: 5
    },
});
