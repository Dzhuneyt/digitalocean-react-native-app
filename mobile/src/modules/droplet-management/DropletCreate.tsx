import {Component} from "react";
import React from "react";
import {ScrollView, StyleSheet} from "react-native";
import {Button, Input, Text} from 'react-native-elements';
import {ISize} from "dots-wrapper/dist/modules/size";
import {DigitalOceanDropletsService} from "../../services/DigitalOceanDropletsService";
import {IRegion} from "dots-wrapper/dist/modules/region";
import {Picker} from '@react-native-community/picker';
import {IImage} from "dots-wrapper/dist/modules/image";
import {ISshKey} from "dots-wrapper/dist/modules/ssh-key";
import Snackbar from 'react-native-snackbar';

export class DropletCreate extends Component<{
    currentApiToken?: string,
}, any> {
    state: {
        availableRegions: IRegion[],
        availableSizes: ISize[],
        availableImages: IImage[],
        sshKeys: ISshKey[],
        currentRegion: IRegion | null,
        currentSize: ISize | null,
        currentImage: IImage | null,
        currentSshKey: ISshKey | null,
        name: string,
    } = {
        availableRegions: [],
        availableSizes: [],
        availableImages: [],
        sshKeys: [],
        currentRegion: null,
        currentSize: null,
        currentImage: null,
        currentSshKey: null,
        name: "",
    };

    private doService?: DigitalOceanDropletsService = undefined;

    private getAvailableRegionsForSize(size: ISize | null) {
        if (size) {
            // If droplet size was already selected,
            // allow selecting in the Regions dropdown
            // only the regions allowed for this size
            return this.state
                .availableRegions
                .filter(regionName2 => {
                    return size.regions.find((regionName1: any) => regionName1 === regionName2.slug);
                });
        } else {
            // Return all available regions
            return this.state
                .availableRegions;
        }
    }

    render() {
        const regions = this.getAvailableRegionsForSize(this.state.currentSize);
        const sizes = this.state.availableSizes;
        const images = this.state.availableImages;


        // Filter the original available DO images based on
        // the current Region and Droplet Size selection
        const filteredImages = images
            .sort((a, b) => String(a.name + a.distribution).localeCompare(String(b.name + b.distribution)))
            .filter(image => {
                if (this.state.currentSize) {
                    if (image.min_disk_size > this.state.currentSize.disk) {
                        return false;
                    }
                }
                if (this.state.currentRegion) {
                    const imageSupportsSelectedRegion = image
                        .regions
                        .find(reg => reg === this.state.currentRegion!.slug);
                    if (!imageSupportsSelectedRegion) {
                        return false;
                    }
                }
                return true;
            });
        console.log('Original list length', images.length)
        console.log('Filtered list length', filteredImages.length);

        filteredImages.forEach(image => {
            console.log(image.distribution, image.name, image.size_gigabytes, image.min_disk_size, image.created_at)
        })

        if (!regions.length || !sizes.length || !filteredImages.length) {
            console.log('No data to populate dropdowns');
            // Do not render anything until we have the necessary information
            return null;
        }

        const regionsForPicker: any[] = regions.map((region: any) => {
            return <Picker.Item label={region.name} key={region.slug} value={region.slug}/>
        });
        regionsForPicker.unshift(<Picker.Item label="Region" key='' value=''/>);

        const sizesForPicker = sizes.map((size: ISize) => {
            const label = `$ ${size.price_monthly} / mo, ${size.disk} Disk, ${size.vcpus} vCPU, ${size.memory} RAM`;
            return <Picker.Item label={label} key={size.slug} value={size.slug}/>
        });
        sizesForPicker.unshift(<Picker.Item label="Size" key='' value=''/>);

        const imagesForPicker = filteredImages
            .map((image: IImage) => {
                const label = `${image.distribution} ${image.name}`;
                return <Picker.Item label={label} key={image.id} value={image.id}/>
            });
        imagesForPicker.unshift(<Picker.Item label="Image" key='' value=''/>);

        const sshKeysForPicker = this.state.sshKeys.map((sshKey) => {
            return <Picker.Item label={sshKey.name} key={sshKey.id} value={sshKey.id}/>
        })
        sshKeysForPicker.unshift(<Picker.Item label={'SSH Key'} key='' value=''/>)

        return <>
            <ScrollView>
                <Input
                    label='Droplet Name'
                    containerStyle={styles.input}
                    onChangeText={text => this.setState({name: text})}
                    placeholder='e.g. ubuntu-2020-03-15'
                />

                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    accessibilityLabel='Droplet Size'
                    selectedValue={this.state.currentSize?.slug}
                    onValueChange={(itemValue) => {
                        const currentSize = this.state
                            .availableSizes
                            .find(size => size['slug'] === itemValue);
                        this.setState({currentSize});
                    }}
                >
                    {sizesForPicker}
                </Picker>

                <Picker
                    style={styles.picker}
                    accessibilityLabel='Region'
                    selectedValue={this.state.currentRegion?.slug}
                    mode="dropdown"
                    onValueChange={(itemValue) => {
                        const currentRegion = this.state
                            .availableRegions
                            .find(region => region['slug'] === itemValue);
                        console.log(itemValue);
                        console.log(currentRegion);
                        this.setState({currentRegion});
                    }}>
                    {regionsForPicker}
                </Picker>

                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={this.state.currentImage?.id}
                    accessibilityLabel='Image'
                    onValueChange={(itemValue) => {
                        const currentImage = this.state
                            .availableImages
                            .find(image => image['id'] === itemValue);
                        this.setState({currentImage});
                    }}
                >
                    {imagesForPicker}
                </Picker>

                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    accessibilityLabel='SSH key'
                    selectedValue={this.state.currentSshKey?.id}
                    onValueChange={(itemValue) => {
                        const currentSshKey = this.state
                            .sshKeys
                            .find(sshKey => sshKey.id === itemValue);
                        this.setState({currentSshKey: currentSshKey});
                    }}
                >
                    {sshKeysForPicker}
                </Picker>
            </ScrollView>
            <Button
                disabled={!this.formIsValid()}
                onPress={() => this.createDroplet()}
                title="Create droplet"
            />
        </>;
    }

    async componentDidMount() {
        this.setState({
            availableRegions: await this.getDigitalOceanService().getRegions(),
            availableSizes: await this.getDigitalOceanService().getSizes(),
            availableImages: await this.getDigitalOceanService().getDistributions(),
            sshKeys: await this.getDigitalOceanService().sshKeys(),
        });
    }

    private getDigitalOceanService() {
        if (this.doService === undefined) {
            console.log(this.props);
            this.doService = new DigitalOceanDropletsService(this.props.currentApiToken);
        }
        return this.doService;
    }

    private async createDroplet() {
        const config = {
            image: this.state.currentImage!.id!,
            name: this.state.name,
            region: this.state.currentRegion!.slug!,
            size: this.state.currentSize!.slug!,
            sshKey: this.state.currentSshKey?.id as number,
        };
        this.getDigitalOceanService().createDroplet(config).then(value => {
            console.log(value);
            console.log('Droplet creation success');
            Snackbar.show({
                text: "Droplet creation started",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "green"
            })
        }).catch(err => {
            console.error(err);
            console.log('Droplet creation FAILED');
            Snackbar.show({
                text: "Droplet creation FAILED",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
            })
        })
    }

    private formIsValid() {
        return !!(this.state.currentImage &&
            this.state.currentRegion &&
            this.state.currentSize &&
            this.state.currentSshKey);

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
