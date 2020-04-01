
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadImageUrl } from '../CommonMethods/CommonInterface';
import { MatSnackBar } from '@angular/material';

export class CommonMethods {

    Tag = "CommonMethods"

    /*
         Show Console Common Method
    */

    public static showconsole(tag: string, message: string) {
        // console.log(tag, message);
    }

    /*
             Upload  Image into firebase Common Method
    */

    static uploadPhoto(folderName: string, Imageurlpath: any, storege: AngularFireStorage, uploadImageInterface: UploadImageUrl) {
        var Tag = "uploadPhoto Method"
        var filePath = `${folderName}/${new Date().getTime()}`;
        const fileRef = storege.ref(filePath);

        storege.upload(filePath, Imageurlpath).snapshotChanges().pipe(
            finalize(() => {
                fileRef.getDownloadURL().subscribe(url => {
                    uploadImageInterface.onUploadImageResponse(url)
                })
            })
        ).subscribe();
    }

    /*
              Show Error Dialog Message Common Method
    */

    static showErrorDialog(snackBar: MatSnackBar, message: string) {
        snackBar.open(message, "", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar']
        });
    }

    /*
          Show Success Dialog Message Common Method
    */

    static showSuccessDialog(snackBar: MatSnackBar, message: string) {
        snackBar.open(message, "", {
            duration: 2000,
            panelClass: ['sucess-snackbar'],
            verticalPosition: 'top'
        });
    }


    static get24hTime(str) {
        str = String(str).toLowerCase().replace(/\s/g, '');
        var has_am = str.indexOf('am') >= 0;
        var has_pm = str.indexOf('pm') >= 0;
        // first strip off the am/pm, leave it either hour or hour:minute
        str = str.replace('am', '').replace('pm', '');
        // if hour, convert to hour:00
        if (str.indexOf(':') < 0) str = str + ':00';
        // now it's hour:minute
        // we add am/pm back if striped out before 
        if (has_am) str += ' am';
        if (has_pm) str += ' pm';
        // now its either hour:minute, or hour:minute am/pm
        // put it in a date object, it will convert to 24 hours format for us 
        var d = new Date("1/1/2011 " + str);
        // make hours and minutes double digits
        var doubleDigits = function (n) {
            return (parseInt(n) < 10) ? "0" + n : String(n);
        };
        return doubleDigits(d.getHours()) + ':' + doubleDigits(d.getMinutes()) + ':' + doubleDigits(d.getSeconds());
    }





}



