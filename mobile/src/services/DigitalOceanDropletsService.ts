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
        return res.status === 202;
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

    async restartDroplet(id: number) {
        const client = await this.getClient();
        let {status, data} = await client.droplet.rebootDroplet({droplet_id: id});
        if (status !== 201) {
            console.error(JSON.stringify(data, null, 2));
            throw new Error(`Can not restart droplet due to errors`);
        }
        return status === 201;
    }

    async shutdownDroplet(id: number) {
        const client = await this.getClient();
        let {status, data} = await client.droplet.shutdownDroplet({droplet_id: id});
        if (status !== 201) {
            console.error(JSON.stringify(data, null, 2));
            throw new Error(`Can not shutdown droplet due to errors`);
        }
        return status === 201;
    }

    async powerOnDroplet(id: number) {
        const client = await this.getClient();
        let {status, data} = await client.droplet.powerOnDroplet({droplet_id: id});
        if (status !== 201) {
            console.error(JSON.stringify(data, null, 2));
            throw new Error(`Can not power on droplet due to errors`);
        }
        return status === 201;
    }

}