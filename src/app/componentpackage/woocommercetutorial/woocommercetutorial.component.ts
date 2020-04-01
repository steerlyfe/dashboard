import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-woocommercetutorial',
  templateUrl: './woocommercetutorial.component.html',
  styleUrls: ['./woocommercetutorial.component.css']
})
export class WoocommercetutorialComponent implements OnInit {


  tutorialList: Array<any>

  constructor() {
    this.tutorialList=[]
    this.pushData()
  }


  pushData(){
    this.tutorialList.push(
      {
        "step":"Step 1",
        "image":"settings1.png",
        "caption":" In Woocommerce click on setting option. This will open settings page."
      },
      {
        "step":"Step 2",
        "image":"advanced2.png",
        "caption":"In setting page click on advance tab."
      },
       {
        "step":"Step 3",
        "image":"restapi3.png",
        "caption":"when you click on advance tab, you can see REST API option."
      }, {
        "step":"Step 4",
        "image":"addkey4.png",
        "caption":"Click on rest api will open add key option. Click on Add Key."
      }, {
        "step":"Step 5",
        "image":"generatekey5.png",
        "caption":"It will open key details. In permission option select Read/Write option. In description about key. In user select user and click on Generate Key button."
      }, {
        "step":"Step 6",
        "image":"keys6.png",
        "caption":"Now you can see consumer key and consumer secret key. Copy and save both keys."
      }, {
        "step":"Step 7",
        "image":"legacyapi7.png",
        "caption":"Now click on Legacy Api in tab."
      }, {
        "step":"Step 8",
        "image":"legacyapinotedited.png",
        "caption":"Click on checkbox to enable legacy rest api. Click on save changes button. Now you have both consumer key and consumer secret. Use these keys to add in woocommerce keys"
      }
    )
  }

  ngOnInit() {
  }

}
