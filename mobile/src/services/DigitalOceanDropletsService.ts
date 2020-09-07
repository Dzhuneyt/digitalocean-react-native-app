import {DigitalOceanBaseService} from "./DigitalOceanBaseService";
import {IDroplet} from "dots-wrapper/dist/modules/droplet";
import {sshKey} from "dots-wrapper/dist/modules";

export class DigitalOceanDropletsService extends DigitalOceanBaseService {

    async getDroplets(): Promise<IDroplet[]> {
        const client = await this.getClient();
        const {data: {droplets}} = await client.droplet.listDroplets(this.defaultParams);
        return droplets;
    }

    async createDroplet(config: {
        name: string,
        image: string | number,
        region: string,
        size: string,
        sshKey: number,
    }): Promise<any> {
        const client = await this.getClient();
        const res = await client.droplet.createDroplet({
            ...config,
            ssh_keys: [
                config.sshKey,
            ]
        });
        console.log(JSON.stringify(res, null, 2));
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