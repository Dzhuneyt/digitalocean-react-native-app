import axios, {AxiosInstance} from "axios";

const DIGITALOCEAN_TOKEN = '3676e424eb211ab2177e9a22429d8b2fb543ac641786b29d9635232defdb0703';

export class DigitalOcean {
    private readonly baseUrl = 'https://api.digitalocean.com/v2/';

    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: this.baseUrl,
            timeout: 5000,
            headers: {'Authorization': `Bearer ${DIGITALOCEAN_TOKEN}`}
        });
    }

    async getDroplets(): [] {
        const res = await this.axios.get('droplets');
        const droplets = res.data.droplets;
        console.log(`Retrieved droplets`, droplets);
        return droplets
    }
}