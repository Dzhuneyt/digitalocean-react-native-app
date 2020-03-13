import AsyncStorage from "@react-native-community/async-storage";
import {createApiClient} from 'dots-wrapper';
import {ISize} from "dots-wrapper/dist/modules/size";

const DIGITALOCEAN_TOKEN = '3676e424eb211ab2177e9a22429d8b2fb543ac641786b29d9635232defdb0703';

export class DigitalOceanBaseService {
    protected readonly baseUrl = 'https://api.digitalocean.com/v2/';
    public readonly defaultParams = {
        per_page: 100,
        page: 0,
    };

    public async getClient() {
        const token = <string>await AsyncStorage.getItem('digitalocean_token');
        return createApiClient({token});
    }

    async getRegions() {
        const client = await this.getClient();
        const {data: {regions}} = await client.region.listRegions(this.defaultParams);

        // Sort regions by name
        regions.sort((a, b) => a.name.localeCompare(b.name));

        // Return available regions
        return regions.filter(region => region.available);
    }

    async getSizes(): Promise<ISize[]> {
        const client = await this.getClient();
        const {data: {sizes}} = await client.size.listSizes(this.defaultParams);
        return sizes.filter(size => size.available);
    }
}
