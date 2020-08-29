import {DigitalOceanBaseService} from "./DigitalOceanBaseService";
import {IDroplet} from "dots-wrapper/dist/modules/droplet";

export class DigitalOceanDropletsService extends DigitalOceanBaseService {

    async getDroplets(): Promise<IDroplet[]> {
        const client = await this.getClient();
        const {data: {droplets}} = await client.droplet.listDroplets(this.defaultParams);
        return droplets;
    }

    async createDroplet(config: {
        name: string,
        image: string,
        region: string,
        size: string,
    }): Promise<any> {
        const client = await this.getClient();
        try {
            const res = await client.droplet.createDroplet({
                ...config
            }).catch(e => {
                console.error(JSON.stringify(e, null, 2));
                throw e;
            })
            console.log(res.status, res.headers);
            return true;
        } catch (e) {
            console.log(JSON.stringify(e, null, 2));
            return false;
        }
    }

    async images() {
        const client = await this.getClient();
        let {data: {images}} = await client.image.listImages({
            ...this.defaultParams,
        });
        images = images.filter(image => image.public);
        images.forEach(image => console.log(image));
        return images;
    }

}