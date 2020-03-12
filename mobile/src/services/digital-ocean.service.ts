import axios, {AxiosInstance} from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const DIGITALOCEAN_TOKEN = '3676e424eb211ab2177e9a22429d8b2fb543ac641786b29d9635232defdb0703';

export class DigitalOceanService {
    protected readonly baseUrl = 'https://api.digitalocean.com/v2/';

    protected axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: this.baseUrl,
            timeout: 5000,
        });
        this.axios.interceptors.request.use(async (value) => {
            // Attach DO token to every request
            const token = await AsyncStorage.getItem('digitalocean_token');
            value.headers['Authorization'] = `Bearer ${token}`;
            return value;
        });
    }

    async getRegions() {
        return await this.axios.get('regions');
    }
}
