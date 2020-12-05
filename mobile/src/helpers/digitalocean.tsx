import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const getToken = async (alias: string) => {
    const doc = await getTokenReference(alias);
    return doc.get();
};


export const getTokenReference = async (alias: string) => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
        throw new Error('Failed to get current user');
    }

    const userUUID = currentUser.uid;
    const globalCollectionForTokens = firestore()
        .collection('digitalocean_tokens');

    return await globalCollectionForTokens
        .doc(userUUID)
        .collection("tokens")
        .doc(alias);
}