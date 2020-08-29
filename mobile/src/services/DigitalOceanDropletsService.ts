import {DigitalOceanBaseService} from "./DigitalOceanBaseService";
import {IDroplet} from "dots-wrapper/dist/modules/droplet";

export class DigitalOceanDropletsService extends DigitalOceanBaseService {

    async getDroplets(): Promise<IDroplet[]> {
        const client = await this.getClient();
        const {data: {droplets}} = await client.droplet.listDroplets(this.defaultParams);
        return droplets;
    }

    async createDroplet(): Promise<any> {
        const client = await this.getClient();
        const res = await client.droplet.createDroplet({
            image: "@TODO",
            name: "",
            region: "",
            size: ""
        });
        return res.status;
    }

    async images() {
        const client = await this.getClient();
        let {data: {images}} = await client.image.listImages(this.defaultParams);
        images = images.filter(image => image.public);
        images.forEach(image => console.log(image));
        return images;
    }

}