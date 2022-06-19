import { Component } from '@angular/core';
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { Device } from '@capacitor/device';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  flags = null
  tag = null
  loader = null
  openCreateModal = false
  detected = false

  constructor(
    private nfc: NFC,
    private ndef: Ndef,
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

  async performOperation() {
    // check if payload exist with nDefMessage
    if (
      this.tag.ndefMessage &&
      this.tag.ndefMessage.length &&
      this.tag.ndefMessage.length > 0 &&
      this.tag.ndefMessage[0].payload
    ) {
      alert('Payload detected: ' + JSON.stringify(this.tag.ndefMessage[0].payload))
      // get if its dirty or not
      const dirtyOrNotResult = await this.getDirtyOrNot()
      console.log(dirtyOrNotResult)
      if (dirtyOrNotResult) {
        alert('Your choice: ' + dirtyOrNotResult)
        // now store in local database for now (later mysql api)
        var tags = []
        try {
          tags = JSON.parse(localStorage.getItem('clothes')) || []
        } catch(e) {
          tags = []
        }
        alert('Local db count: ' + tags.length.toString())
        var newDetails = {
          id: this.tag.id,
          status: dirtyOrNotResult,
          createdAt: new Date().toISOString(),
        }
        tags.push(newDetails)
        localStorage.setItem('clothes', JSON.stringify(tags))
        alert('Local db updated with new entry: ' + JSON.stringify(newDetails))
      }
    } else {
      alert('Tag is empty!')
      // no payload ask server for new
      const payload = new Date().getTime()
      alert('New payload generated: ' + payload.toString())

      if (this.tag.isWritable) {
        // now write this info on the tag
        try {
          var message = [
            this.ndef.mimeMediaRecord('text/plain', payload.toString()),
          ];
        } catch(e) {
          alert(JSON.stringify(e))
        }

        alert('Message created!')

        this.nfc.write(message).then((res) => {
          // create the form for input (new modal)
          this.openCreateModal = true
          alert('New data is written to tag')
        }).catch((err) => {
          alert('Issue in writing to NFC')
        })
      } else {
        alert('NFC tag is not writable!')
      }

    }

  }

  async getDirtyOrNot() {
    var result = ''
    const alert = await this.alertController.create({
      header: 'Is it dirty ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            result = 'dirty'
          }
        },
        {
          text: 'No',
          handler: () => {
            result = 'clean'
          }
        }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return result
  }


  async readNfc() {
    const info = await Device.getInfo();

    this.detected = false

    await this.presentLoading('Scanning NFC...')

    if (info.platform === 'android') {
      // this.flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      // this.nfc.readerMode(this.flags).subscribe(
      //   tag => {
      //     this.tag = tag
      //     this.loader.dismiss()
      //   },
      //   err => {
      //     alert(JSON.stringify(err))
      //     this.loader.dismiss()
      //   })
      this.nfc.addNdefListener((s) => {
      }, (err) => {
        alert('Error in starting NFC reader: ' + JSON.stringify(err))
      }).subscribe((res) => {
        if (this.detected) {
          return
        }
        alert(JSON.stringify(res))
        this.loader.dismiss()
        this.tag = res.tag
        this.detected = true
        this.performOperation()
      }, (e) => {
        alert('err from subs' + JSON.stringify(e))
        this.loader.dismiss()
      }, () => {
      });
    } else {
      alert('NFC support not available')
      // this.loader.dismiss()
      // this.tag = {
      //   id: 2,
      //   nDefMessage: []
      // }
      // this.performOperation()
    }
  }
}
