import { Component, OnInit, NgZone, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from './sidebar.service';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
import { NavService } from './nav.service';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class FullComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  @ViewChild('sidenav', { static: false }) appDrawer: ElementRef<any>;
  @ViewChild('toggle', { static: false }) togglebar;
  Tag = "FullComponent"
  menus: Array<any> = []
  screenWidth: number;
  pageName = "Employee"
  profilename: string;
  profiletype: string;
  topHeading: string;
  admindata: any
  imageurl: any
  togglebutton = false
  accountType: string
  storeAccountId: string
  currentmenuIndex: any
  currentInnermenuIndex: any
  userName:string
  previousIndex:string
  screenHeight: number;
  screenWidthsecond: number;
  
  constructor(private sidebarservice: SidebarService, public router: Router, public ngzone: NgZone,
    public cookiesService: CookieService, public spinner: NgxSpinnerService, public snackBar: MatSnackBar,
    private navService: NavService, public activatedRouter: ActivatedRoute) {
    this.togglebutton = false
    this.topHeading = ""
    this.accountType = ""
    this.userName=""
    this.storeAccountId = ""
    this.currentmenuIndex = ""
    this.currentInnermenuIndex = ""
    this.previousIndex=""
    this.screenHeight=0;
    this.screenWidthsecond=0;
    
    this.checkLogin()

  }
  checkLogin() {
    CommonMethods.showconsole(this.Tag, "Check Login Status into Ful Component")
    var loginstatus = MyCookies.checkLoginStatus(this.cookiesService)
    this.accountType = MyCookies.getAccountType(this.cookiesService)
    if (loginstatus) {
      this.imageurl = "assets/images/profile.jpg"
      if (this.accountType == "admin") {
        this.profilename = MyCookies.getStoreName(this.cookiesService)
        this.imageurl = MyCookies.getStoreImage(this.cookiesService)
        this.userName = MyCookies.getUserName(this.cookiesService)
        this.profiletype = MyCookies.getAccountType(this.cookiesService)
      } else if (this.accountType == "manager") {
        this.profilename = MyCookies.getStoreName(this.cookiesService)
        this.imageurl = MyCookies.getStoreImage(this.cookiesService)
        this.profiletype = MyCookies.getAccountType(this.cookiesService)
      } else if (this.accountType == "employee") {
        this.profilename = MyCookies.getStoreName(this.cookiesService)
        this.imageurl = MyCookies.getStoreImage(this.cookiesService)
        this.profiletype = MyCookies.getAccountType(this.cookiesService)
      } else if (this.accountType == "sub_admin") {
        this.profilename = MyCookies.getStoreName(this.cookiesService)
        this.imageurl = MyCookies.getStoreImage(this.cookiesService)
        this.profiletype = "Sub Admin"
      } else if (this.accountType == "sub_manager") {
        this.profilename = MyCookies.getStoreName(this.cookiesService)
        this.imageurl = MyCookies.getStoreImage(this.cookiesService)
        this.profiletype = "Sub Manager"
      } else if (this.accountType == "sub_employee") {
        this.profilename = MyCookies.getStoreName(this.cookiesService)
        this.imageurl = MyCookies.getStoreImage(this.cookiesService)
        this.profiletype = "Sub Employee"
      } else {
        this.profiletype = "Super Admin"
        this.profilename = MyCookies.getUserName(this.cookiesService)

      }


      this.menus = this.sidebarservice.getMenuList();
      // this.checkAndSetValue()
      this.router.events.subscribe(value => {
        if (value instanceof NavigationEnd) {

          this.checkAndSetValue()

          // if (this.mainContainer != undefined) {
          //   this.mainContainer.nativeElement.scrollIntoView();
          // }

        }
      })
      // CommonMethods.showconsole(thi  s.Tag, "Menu List:- " + JSON.stringify(this.menus))
      this.screenWidth = window.innerWidth;
      window.onresize = () => {
        this.screenWidth = window.innerWidth;
        //  CommonMethods.showconsole(this.Tag,"Inner Width:- "+this.screenWidth)
      };
      setTimeout(() => {
        this.getScreenSize()
      }, 1000);
      

    }
    else {

      MyRoutingMethods.gotoLogin(this.router)
    }
  }




  ngOnInit() {

  }
  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }
  


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidthsecond = window.innerWidth;

        // console.log(this.screenHeight, this.screenWidthsecond);

         if(this.screenWidthsecond === 900 || this.screenWidthsecond < 900)
         {
            CommonMethods.showconsole(this.Tag,"if is working ")
          document.getElementById('toggle').classList.remove("change")
          this.togglebutton = true
         }else{
          CommonMethods.showconsole(this.Tag,"else is working ")
          document.getElementById('toggle').classList.add("change")
          this.togglebutton = false
         }
  }


  toggle(currentMenu) {
    if (currentMenu.type === 'dropdown') {

      this.menus.forEach(element => {


        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;

        } else {
          element.active = false;
        }
      });
    }
  }

  menuDrawer() {


    if (this.togglebutton == false) {
          CommonMethods.showconsole(this.Tag,"If is working")
      this.navService.closeNav();
      document.getElementById('toggle').classList.remove("change")
      this.togglebutton = true

    }
    else {
      CommonMethods.showconsole(this.Tag,"else is working")
      this.navService.openNav();
      document.getElementById('toggle').classList.add("change")
      this.togglebutton = false
    }

  }
   closeNavOnly()
   {
    this.navService.closeNav();
    document.getElementById('toggle').classList.remove("change")
    this.togglebutton = true
   }


  getState(currentMenu) {

    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  // hasBackgroundImage() {
  //   return this.sidebarservice.hasBackgroundImage;
  // }

  gotoNextPage(index) {
    this.router.navigate(['/' + this.menus[index].url]);
    this.topHeading = this.menus[index].title
  }
  gotoSubmenuPage(oterindex: number, innerindex: number) {

    this.router.navigate(['/' + this.menus[oterindex].innerOptions[innerindex].url])
    this.topHeading = this.menus[oterindex].innerOptions[innerindex].title
  }

  getRoutingPath(i): string {
    return this.menus[i].path
  }

  // checkstatus() {
  //   this.ngzone.run(() => {

  //     var currentUrl = this.router.url

  //     var matched = false
  //     this.menus.forEach(element => {

  //       element.status = "inactive"

  //       if (!matched) {
  //         if (currentUrl == "/" + element.url) {
  //           this.topHeading = element.title
  //           element.status = "active"
  //         }
  //       }
  //       element.innerOptions.forEach(innerElement => {

  //         if (!matched) {

  //           if (currentUrl == "/" + innerElement.url) {
  //             this.topHeading = innerElement.title

  //           } else if (currentUrl == "/add/store") {
  //             this.topHeading = ""
  //           }
  //         }
  //       })
  //     })
  //   })
  // }
  checkAndSetValue() {
    CommonMethods.showconsole(this.Tag, "  checkAndSetValue() ")
    this.ngzone.run(() => {
      this.topHeading = ""
      var currentUrl = this.router.url

      
      CommonMethods.showconsole(this.Tag, "Current Url:- " + currentUrl)
      
      var matched = false
      this.menus.forEach((element, index) => {

        element.status = "inactive"
        // var currentIcon=element.icon.split('_')
       
        //  CommonMethods.showconsole(this.Tag,"Show Length Of  icon:- "+currentIcon)
        //  CommonMethods.showconsole(this.Tag,"Show Length Of  icon:- "+currentIcon.length)

        //   CommonMethods.showconsole(this.Tag,"Current active Image- "+element.icon)
        //   for(var i=0;i<currentIcon.length;i++)
        //   {
        //      if(currentIcon[i] == 'active')
        //      {
        //          CommonMethods.showconsole(this.Tag,"main index:- "+currentIcon[i])
        //          CommonMethods.showconsole(this.Tag,"main index:- "+index)
        //          CommonMethods.showconsole(this.Tag,"index :- "+i)
        //             splice
        //      }
        //   }

        

        if (!matched) {
           CommonMethods.showconsole(this.Tag,"Show Element url:- "+"/" + element.url)
          if (currentUrl == "/" + element.url) {
            matched = true
            //    var activeicon = element.icon+"_active"
            //   //  CommonMethods.showconsole(this.Tag,"Current active Image: "+activeicon )
            //    element.icon = activeicon
            //  CommonMethods.showconsole(this.Tag,"Current active Image: "+element.icon )
            this.topHeading = element.title
            element.status = "active"
            CommonMethods.showconsole(this.Tag, "Current main Menu Index :- " + this.currentmenuIndex)
            this.currentmenuIndex = index
            CommonMethods.showconsole(this.Tag, "Current main Menu Index :- " + this.currentmenuIndex)
            
          }
        }
        element.urlTitleList.forEach(pageInnerUrls => {
          if (!matched) {
            if (currentUrl.includes(pageInnerUrls.url) ) {
              matched = true
              this.topHeading = pageInnerUrls.title
              element.status = "active"
            }
          }
        });
        element.innerOptions.forEach((innerElement, innerIndex) => {
          innerElement.status = "inactive"


          if (!matched) {

            if (currentUrl == "/" + innerElement.url) {
              matched = true
              this.topHeading = innerElement.title
              innerElement.status = "active"
              element.status = "active"
              this.currentInnermenuIndex = innerIndex
              this.currentmenuIndex = index
              // CommonMethods.showconsole(this.Tag, "Status:- " + element.status)
              CommonMethods.showconsole(this.Tag, "Current main Menu Index :- " + index)
              CommonMethods.showconsole(this.Tag, "Current main inner Menu Index :- " + innerIndex)
            }
          }
          innerElement.urlTitleList.forEach(pageInnerUrls => {
            if (!matched) {
              if (currentUrl.includes(pageInnerUrls.url) ) {
                matched = true
                this.topHeading = pageInnerUrls.title
                innerElement.status = "active"
                element.status = "active"
              }
            }
          });
        })
      })

    })
  }


  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }


  logout() {
    CommonMethods.showconsole(this.Tag, "Working Click ")
    this.cookiesService.deleteAll('/')
    // MyCookies.checkLoginStatus(this.cookiesService)
    CommonMethods.showconsole(this.Tag, "Account type:- " + MyCookies.getAccountType(this.cookiesService))
    MyRoutingMethods.gotoLogin(this.router)
  }





}
