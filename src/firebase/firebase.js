import './config';
import 'firebase/firestore'
import * as firebase from 'firebase'

const collections = {
    highscore: "highscore"
}

const db = firebase.firestore()

//write & remove

export const write = (item) => {
    db.collection(collections.highscore).doc(item.highscore).set(item)
        .then(() => {
        console.log("Document successfully written!");
        })
        .catch(error => {
        console.error("Error writing document: ", error);
        });
}

export const remove = (item) => {
    db.collection(collections.highscore).doc(item).delete()
        .then(() => {
            console.log("Le doc a été retiré avec succès")
        })
        .catch(error => {
            console.error("Erreur à la suppression du document", error);
        })
}

//read

export const read = () => {
    return new Promise((resolve, reject) => {
        db.collection(collections.highscore)
            .get()
            .then(querySnapshot => {
                resolve(querySnapshot)
            })
            .catch(err => reject(err))
    })
}       