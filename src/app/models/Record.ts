import firebase from 'firebase/compat/app'

export default interface IRecord {
  docID?: string;
  uid: string;
  displayName: string;
  title: string | null;
  fileName: string;
  url: string;
  timestamp: firebase.firestore.FieldValue;
  screenshotURL: string;
  screenshotFileName: string;
}