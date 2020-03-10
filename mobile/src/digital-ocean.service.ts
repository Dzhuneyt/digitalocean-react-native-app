import axios, {AxiosInstance} from "axios";

const DIGITALOCEAN_TOKEN = '3676e424eb211ab2177e9a22429d8b2fb543ac641786b29d9635232defdb0703';

export class DigitalOceanService {
    private readonly baseUrl = 'https://api.digitalocean.com/v2/';

    private axios: AxiosInstance;

    public apiToken = DIGITALOCEAN_TOKEN;

    constructor() {
        this.axios = axios.create({
            baseURL: this.baseUrl,
            timeout: 5000,
        });
        this.axios.interceptors.request.use(value => {
            // Attach DO token to every request
            value.headers['Authorization'] = `Bearer ${this.apiToken}`;
            return value;
        });
    }

    async getDroplets(): Promise<[]> {
        const res = await this.axios.get('droplets');
        return res.data.droplets;
    }
}
