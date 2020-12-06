import auth from "@react-native-firebase/auth";
import {Token} from "../interfaces/Token";
import firestore from "@react-native-firebase/firestore";

export class DigitalOceanTokenService {
    async getTokens() {
        const currentUser = auth().currentUser;

        if (!this.checkForLogin() || !currentUser) {
            throw new Error('Failed to get current user');
        }

        /**
         * Format Firebase snapshot and set it as component state
         * @param snapshot
         */
        const _processSnapshot = (snapshot: any) => {
            if (!snapshot) {
                this.setState({
                    accounts: [],
                });
                return;
            }
            const accounts: Token[] = [];
            snapshot.forEach((item: { ref: { id: any; }; get: (arg0: string) => any; }) => {
                const obj: Token = {
                    alias: item.ref.id,
                    token: String(item.get('token')),
                };
                if (item.get('created_at')) {
                    obj.created_at = Number(item.get('created_at'));
                }
                accounts.push(obj);
            });
            this.setState({
                accounts,
            });
            console.log('New DO accounts list received and set in UI:', JSON.stringify(accounts.length, null, 2));
        };

        // Get current snapshot immediately (don't wait for online sync)
        const snapshot = await firestore()
            .collection('digitalocean_tokens')
            .doc(currentUser.uid)
            .collection("tokens")
            .get();

        _processSnapshot(snapshot);

        // Listen for changes on the Firestore real-time and reflect in component every time
        firestore()
            .collection('digitalocean_tokens')
            .doc(currentUser.uid)
            .collection("tokens")
            .onSnapshot(snapshot => {
                _processSnapshot(snapshot);
            }, error => {
                // @TODO send this error to Firebase Crashlytics
                console.log(error);
                _processSnapshot([]);
            });
    }
}