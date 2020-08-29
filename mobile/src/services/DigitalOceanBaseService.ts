import AsyncStorage from "@react-native-community/async-storage";
import {createApiClient} from 'dots-wrapper';
import {ISize} from "dots-wrapper/dist/modules/size";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const DIGITALOCEAN_TOKEN = '3676e424eb211ab2177e9a22429d8b2fb543ac641786b29d9635232defdb0703';

export class DigitalOceanBaseService {
    protected readonly baseUrl = 'https://api.digitalocean.com/v2/';
    public readonly defaultParams = {
        per_page: 1000,
        page: 0,
    };
    protected readonly token: string = '';

    constructor(token?: string) {
        if (token) {
            this.token = token;
        }
    }

    public async getClient() {
        const token = this.token ? this.token : await this.getCurrentDigitaloceanToken();
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

    async getDistributions() {
        const client = await this.getClient();
        const {data: {images}} = await client.image.listImages({
            per_page: 1000,
            type: "distribution",
            user_images: false,
        })
        return images.filter(image => image.status = "available");
    }

    async getCurrentDigitaloceanToken() {
        if (!auth().currentUser) {
            return false;
        }
        // Get the users ID
        const uid = auth().currentUser?.uid;

        // Read the document for user 'Ada Lovelace':
        const documentSnapshot = await firestore()
            .collection('digitalocean_tokens')
            .doc(uid)
            .get();

        return documentSnapshot ? documentSnapshot.get('token') : false;
    }
}
