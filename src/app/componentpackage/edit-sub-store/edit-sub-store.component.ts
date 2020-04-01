import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { UploadImageUrl, AddSubStore } from 'src/app/CommonMethods/CommonInterface';
import { DatePipe, Location } from '@angular/common';
import { MyConstants } from 'src/app/utilpackages/constant';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { PhotouploadfirebaseService } from 'src/app/firebaseconsole/photouploadfirebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { DailogboxComponent } from '../dailogbox/dailogbox.component';
import { } from '@agm/core/services/google-maps-types';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { formatDate } from '@angular/common';
import { timestamp } from 'rxjs/operators';
import { EditSubStoreModel } from 'src/app/modelspackages/edit-sub-store';
declare var google: any;

@Component({
  selector: 'app-edit-sub-store',
  templateUrl: './edit-sub-store.component.html',
  styleUrls: ['./edit-sub-store.component.css'],
  providers: [DatePipe]
})
export class EditSubStoreComponent implements OnInit {

  Tag = "AddSubStoresComponent"
  @ViewChild('search', { static: true }) searchElementRef: ElementRef;
  editSubStoreModel: EditSubStoreModel
  zoom: number
  origin: any;
  private geoCoder;
  firebaseiimageurl: string
  urlaccountType=""
  accountType=""
  constructor(public router: Router, public spinner: NgxSpinnerService, public activatedRouter: ActivatedRoute,
    public dialog: MatDialog, public cookiesService: CookieService, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader,
    public datepipe: DatePipe, public uploadservice: PhotouploadfirebaseService, private storage: AngularFireStorage,
    public httpClient: HttpClient, public snackBar: MatSnackBar, private datePipe: DatePipe,private location:Location) {

    this.editSubStoreModel = new EditSubStoreModel("", "", "", "", "", "", "", "", "", "", "", "")

    this.checkLoginStatus()
  }

  checkLoginStatus() {
    var loginstatus = MyCookies.checkLoginStatus(this.cookiesService)
    if (loginstatus) {
       this.accountType = MyCookies.getAccountType(this.cookiesService)

      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      // this.activatedRouter.params.subscribe(params => {
      //   CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
      //   this.urlaccountType = params['substoreId']
      // })

           
      
      if (this.accountType == this.urlaccountType) {
        if (this.accountType == "super_admin") {
          this.editSubStoreModel.storeId = this.cookiesService.get('substoreId');
        } else if (this.accountType == "admin" || this.accountType  == "manager") {
          this.editSubStoreModel.storeId = MyCookies.getStoreAccountId(this.cookiesService)
        } else {
  
        }
        this.origin = ""
        this.editSubStoreModel.bannerurl = "assets/images/gallery.png"
        this.firebaseiimageurl = ""
        this.loadMap()
        
      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }

   
    } else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }

  loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {

      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {

          var place = autocomplete.getPlace();


          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //  CommonMethods.showconsole(this.Tag,"place:- "+JSON.stringify(place) )
          //  CommonMethods.showconsole(this.Tag,"formatted_address:- "+place.formatted_address )
           this.editSubStoreModel.address=place.formatted_address
           CommonMethods.showconsole(this.Tag,"address place:- "+this.editSubStoreModel.address)

          this.editSubStoreModel.lat = place.geometry.location.lat();
          this.editSubStoreModel.lng = place.geometry.location.lng();


          this.zoom = 16;
          // this.getAddress(this.editSubStoreModel.lat, this.editSubStoreModel.lng);
        });
      });

    });
  }




  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.editSubStoreModel.lat = position.coords.latitude;
        this.editSubStoreModel.lng = position.coords.longitude;

        this.zoom = 16;
        // this.getAddress( this.editSubStoreModel.lat, this.editSubStoreModel.lng);
        this.origin = { lat: position.coords.latitude, lng: position.coords.longitude };
      });
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  // mapClicked($event: MouseEvent) {
  //   this.editSubStoreModel.lat = $event.coords.lat;
  //   this.editSubStoreModel.lat = $event.coords.lng;
  //   CommonMethods.showconsole(this.Tag," before Lat:- "+this.editSubStoreModel.lat)
  //   CommonMethods.showconsole(this.Tag,"before Long: "+this.editSubStoreModel.lng)
  // }

  markerDragEnd($event: MouseEvent) {
    console.log('dragEnd', $event);
    this.editSubStoreModel.lat = $event.coords.lat;
    this.editSubStoreModel.lng = $event.coords.lng;
    CommonMethods.showconsole(this.Tag, "Lat:- " + this.editSubStoreModel.lat)
    CommonMethods.showconsole(this.Tag, "Long: " + this.editSubStoreModel.lng)
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 16;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  onSelectFile(event) {
    // this.firebaseiimageurl=""
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent) => {
        this.editSubStoreModel.bannerurl = (<FileReader>innerEvent.target).result;
        this.editSubStoreModel.selectbannerurl = event.target.files[0]
      }
    }
  }

  validation() {
    
     CommonMethods.showconsole(this.Tag,"Address+ "+this.editSubStoreModel.address)
    var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.validationTime()
    // CommonMethods.showconsole(this.Tag,"Coloe TIme : "+CommonMethods.get24hTime(this.editSubStoreModel.closingTime))
    if (this.editSubStoreModel.selectbannerurl.length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Select Banner Image")

      return false
    } else if (this.editSubStoreModel.description.trim().length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Description")
      return false
    } else if (this.editSubStoreModel.address.trim().length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Address")
      return false
    } else if (this.editSubStoreModel.phoneNumber.length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Phone Number")
      return false
    } else if (this.editSubStoreModel.email.trim().length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Email")
      return false
    } else if (!EMAIL_REGEXP.test(this.editSubStoreModel.email)) {
      CommonMethods.showErrorDialog(this.snackBar, "Email is inValid")
      return false
    } else if (this.editSubStoreModel.openingTime.length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Opening Time")
      return false
    } else if (this.editSubStoreModel.closingTime.length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Closing Time")
      return false;
    } else if(!this.validationTime()){
        return false
    }
    else {
      return true
    }
  }

  // ampm(time) {
  //   console.log(time);
  //   if (time.value !== "") {
  //     var hours = time.split(":")[0];
  //     var minutes = time.split(":")[1];
  //     var suffix = hours >= 12 ? "pm" : "am";
  //     hours = hours % 12 || 12;
  //     hours = hours < 10 ? "0" + hours : hours;
  //     var displayTime = hours + ":" + minutes + " " + suffix;
  //     document.getElementById("display_time").innerHTML = displayTime;
  //   }
  // }
  validationTime() {
    var todaydate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    var openTime = todaydate + " " + this.editSubStoreModel.openingTime
    var timestampOpenTime = (new Date(openTime)).getTime() / 1000
    var closedTime = todaydate + " " + this.editSubStoreModel.closingTime
    var timestamCloseTime = (new Date(closedTime)).getTime() / 1000
    var isvalidate = true
    if (timestamCloseTime < timestampOpenTime) {
      CommonMethods.showErrorDialog(this.snackBar, "Opening time can't be more than close time ")
      isvalidate = false;
      return isvalidate;
    } else {
      return isvalidate
    }
  }

  updateSubStoreApi() {




    if (this.validation()) {
         CommonMethods.showconsole(this.Tag,"Show  validation:- "+this.validation())
      if (this.firebaseiimageurl.length === 0) {

        this.uploadservice.signIn().then(res => {
          this.spinner.show()
          CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_BANNER, this.editSubStoreModel.selectbannerurl, this.storage, this)
        }).catch(res => {
          CommonMethods.showconsole(this.Tag, "Working  on error:- " + res)
        })
      }
      else {
        CommonWebApiService.addSubStore(this.spinner, this.httpClient, this.cookiesService, this, this.editSubStoreModel, this.firebaseiimageurl,this.snackBar)

      }


    }
  }

  onUploadImageResponse(firebaseimageurl: string) {
    CommonMethods.showconsole(this.Tag, "Fire Image Url :- " + firebaseimageurl)
    this.firebaseiimageurl = firebaseimageurl
    CommonWebApiService.addSubStore(this.spinner, this.httpClient, this.cookiesService, this, this.editSubStoreModel, firebaseimageurl,this.snackBar)

  }

  onResponseAddSubStore(status: string, message: string) {
    switch (status) {
      case "1":
        CommonMethods.showSuccessDialog(this.snackBar, message)
        if (MyCookies.getAccountType(this.cookiesService) == "super_admin") {
          MyRoutingMethods.gotoSuperadminviewSubStore(this.router, this.editSubStoreModel.storeId,this.accountType)
        }
        else {
          MyRoutingMethods.gotoviewSubStore(this.router,this.accountType)
        }
        break;
      case "10":
      CommonMethods.showErrorDialog(this.snackBar,"Session Time Out")
      MyCookies.deletecookies(this.cookiesService)
      MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        CommonMethods.showErrorDialog(this.snackBar, message)
        break;
      case "0":
        CommonMethods.showErrorDialog(this.snackBar, message)
        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }
  }




  openDialog(): void {
    const dialogRef = this.dialog.open(DailogboxComponent, {
      data: { message: "Session Time Out" }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }



  ngOnInit() {
  }

  pagename() {
    return "Add Sub Store"
  }

}
