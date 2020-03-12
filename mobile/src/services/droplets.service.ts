import {DigitalOceanService} from "./digital-ocean.service";

export class DropletsService extends DigitalOceanService {

    async getDroplets(): Promise<[]> {
        const res = await this.axios.get('droplets');
        return res.data.droplets;
    }

    async createDroplet(): Promise<any> {
        const res = await this.axios.post('droplet');
        console.log(res);
        return res;
    }

}