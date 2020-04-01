import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CommonMethods } from '../utilpackages/common-methods';
import { MyConstants } from '../utilpackages/constant';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PhotouploadfirebaseService   {
  Tag="PhotouploadfirebaseService"
  constructor(public firebaseAuth:AngularFireAuth,public Storage:AngularFireStorage) { }
  signIn() {
    return new Promise((resolove,reject) =>{
      this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(MyConstants.FIREBASE_EMAIL, MyConstants.FIREBASE_PASSWORD)
      .then(res => {
        resolove(res)
         CommonMethods.showconsole(this.Tag,"Login  Successfully :- "+res)
      })
      .catch(err => {
        reject(err)
      });
    });
    
  }

  
}

