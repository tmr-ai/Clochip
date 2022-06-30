import { Component } from '@angular/core';
import { NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { Device } from '@capacitor/device';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private nfc: NFC, 
    public alertController: AlertController,
  ) {
  }

  getD(c) {
    return JSON.stringify(c)
  }

  async presentAlert() {
    const alertPop = await this.alertController.create({
      header: 'NFC Scanner',
      subHeader: 'detecting...',
      message: 'You can press the stop button once scanning is over',
      buttons: ['Stop']
    });

    await alertPop.present();

    const { role } = await alertPop.onDidDismiss();
    this.startDetection = false
    this.compute()
  }

  compute() {
    // get local db
    var data = []
    try {
      data = JSON.parse(localStorage.getItem('data')) || []
    } catch(e) {
      data = []
    }

    alert('detected Ids' + JSON.stringify(Array.from(this.detectedIds)))

    this.detectedIds.forEach((item) => {
      const val = data.find((v) => v.id === item)
      if (val)
      this.detectedData.push(val)
    })
  }

  async startScan() {
    const info = await Device.getInfo();

    this.detected = false
    this.startDetection = true
    this.detectedData = []
    this.detectedIds = new Set()

    if (info.platform === 'android') {
      await this.presentAlert()

      let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      this.nfc.readerMode(flags).subscribe(
        tag => {
          alert('tag detected!' + JSON.stringify(this.nfc.bytesToHexString(tag.id)))
          this.detectedIds.add(this.nfc.bytesToHexString(tag.id))
        },
        err => {
          alert('error reading tag')
        }
      );
    } else {
      this.startDetection = false
      alert('NFC support not available')
    }
  }

  async showRecommendation() {
    const alert = await this.alertController.create({
      header: 'Recommendation',
      message: ' \
      Washing Temperature: <br/> \
      Spinning Cycles: <br/> \
      Note: \
      Under development \
      ',
      buttons: ['OK']
    });

    await alert.present();
  }
}
