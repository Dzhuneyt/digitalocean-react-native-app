export interface Droplet {
    // @see https://developers.digitalocean.com/documentation/v2/#list-all-droplets for all possible value
    image: { distribution: string, name: string };
    region: { name: string, slug: string };
    disk: number;
    memory: number;
    id: number;
    name: string;
    networks: {};
    created_at: string;
    status: "new" | "active" | "off" | "archive";
}