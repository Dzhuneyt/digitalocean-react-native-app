import auth from "@react-native-firebase/auth";
import firestore, {FirebaseFirestoreTypes} from "@react-native-firebase/firestore";

export const getAlias = async (alias: string) => {
    const doc = await getAliasDocumentReference(alias);
    return doc.get();
};


export const getAliasDocumentReference = async (alias: string) => {
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