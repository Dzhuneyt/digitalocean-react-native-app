export function getIpV4(networks: any) {
    const ips: any[] = [];
    if (!networks.hasOwnProperty('v4')) {
        return "";
    }
    networks.v4.forEach((network: any) => {
        ips.push(network.ip_address);
    });
    return ips.join(", ");
}

export const humanFriendlySize = function (bytes: number) {
    if (bytes == 0) {
        return "0.00 B";
    }
    const e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(0) + '' + ' KMGTP'.charAt(e) + 'B';
}