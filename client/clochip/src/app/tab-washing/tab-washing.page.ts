import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { Device } from '@capacitor/device';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-tab-washing',
  templateUrl: 'tab-washing.page.html',
  styleUrls: ['tab-washing.page.scss']
})
export class TabWashingPage {
  detected = false
  loader = null
  startDetection = false
  detectedData = []
  detectedIds = new Set()
  nfc = null

  recommendationMsg = ''

  constructor(
    private http: HttpClient,
    private changeRef: ChangeDetectorRef,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
  }

  async presentLoading(message) {
    this.loader = await this.loadingController.create({
      message,
    });
    await this.loader.present();
  }

  // needed to format spinning recommendation
  spinningFormatter(value: number) {
    switch(value) {
      case 0: return 0
      case 1: return 0
      case 2: return 400
      case 3: return 800
      case 4: return 1200
    }
  }


  async presentAlert() {
    // alert pop up while bulk scanning
    const alertPop = await this.alertController.create({
      header: 'NFC Scanner',
      subHeader: 'detecting...',
      message: 'You can press the stop button once scanning is over',
      buttons: ['Stop']
    });

    await alertPop.present();

    const { role } = await alertPop.onDidDismiss();
    this.startDetection = false

    // now fetch the data from api server and create recommendation
    this.compute()
  }

  async compute() {
    // get all information from each tag and compute recommendation
    await this.presentLoading('computing...')

    const temperature = []
    const spinningCycles = []
    const colors = []
    const materials = []

    this.detectedData = Array.from(this.detectedIds)

    //alert('The following Ids were detected:' + JSON.stringify(Array.from(this.detectedIds)))
    alert('Scanning was sucessful! Press on RECOMMENDATION to get washing suggestion.')


    // find parameter to compute the recommendation
    for(let item = 0; item < this.detectedData.length; item ++) {
      const res = await this.http.get(environment.apiUrl + '/item/single?idItem=' + this.detectedData[item]).toPromise();

      if (res['length'] && res['length'] > 0) {
        temperature.push(res[0].nmbTemperature)
        spinningCycles.push(res[0].nmbSpinningCycles)
        colors.push(res[0].setColor)
        materials.push(res[0].setMaterial)

        this.detectedData[item] = res[0]
      }
    }

    // now compute min temp and spinning cycle
    const minTemp = Math.min.apply(Math, temperature)
    const minSpinningCycle = Math.min.apply(Math, spinningCycles)

    var notes = ''

    // white exist and its count is greater than 1 which means white is mixed with colors
    if (colors.includes('white') && Array.from(new Set(colors)).length > 1) {
      notes = 'Attention: You are mixing white clothes with colored ones, maybe use a color catch cloth.<br/>'
    }
    // if whool or leather is detected, warn user
    if (materials.includes('Wool') || materials.includes('leather')) {
      notes += 'Attention: You have an delicate item in your laundry, consider hand washing it.'
    }

    // if note is still not set, everything is good
    if (!notes) {
      notes = 'Looks good, you can start washing.'
    }

    this.recommendationMsg = ` \
      Washing Temperature: ${minTemp}°C<br/> \
      Spinning Cycles: ${this.spinningFormatter(minSpinningCycle).toString()}<br/> \
      Note: ${notes}\
      `

    this.loader.dismiss()

    this.changeRef.detectChanges();
  }

  async startScan() {
    const info = await Device.getInfo();

    this.nfc = new NFC()

    // set all data to initial state
    this.detected = false
    this.startDetection = true
    this.detectedData = []
    this.detectedIds = new Set()

    if (info.platform === 'android') {

      // start the nfc listener for android
      this.nfc.addNdefListener(async(s) => {
        //alert(JSON.stringify(s))
        // start alert here so that alert is shown only after nfc is enabled
        await this.presentAlert()
      }, (err) => {
        alert('Error in starting NFC reader: ' + JSON.stringify(err))
      }).subscribe((res) => {
          // only act if tag has some payload (is written/used) and when detection is running
          if (
            res.tag.ndefMessage &&
            res.tag.ndefMessage.length &&
            res.tag.ndefMessage.length > 0 &&
            res.tag.ndefMessage[0].payload &&
            this.startDetection
          ) {
            // convert the tag data to readable form
            const tagId = this.nfc.bytesToString(res.tag.ndefMessage[0].payload)
            // add the human readable tag id in the set for further operation
            this.detectedIds.add(tagId)
          }
      }, (e) => {
       // alert(JSON.stringify(e))
      });
    } else {
      this.startDetection = false
      alert('NFC support not available')
    }
  }

  async showRecommendation() {
    // display recommendation to user
    const alert = await this.alertController.create({
      header: 'Recommendation',
      message: this.recommendationMsg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
