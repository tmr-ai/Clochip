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
      this.tag.nDefMessage &&
      this.tag.nDefMessage.length &&
      this.tag.nDefMessage.length > 0 &&
      this.tag.nDefMessage[0].payload
    ) {
      // get if item is dirty or not
      const dirtyOrNotResult = await this.getDirtyOrNot()
      console.log(dirtyOrNotResult)
      if (dirtyOrNotResult) {
        // now store in local database for now (later mysql api)
        var tags = []
        try {
          tags = JSON.parse(localStorage.getItem('clothes')) || []
        } catch(e) {
          tags = []
        }
        var newDetails = {
          id: this.tag.id,
          status: dirtyOrNotResult,
          createdAt: new Date().toISOString(),
        }
        tags.push(newDetails)
        localStorage.setItem('clothes', JSON.stringify(tags))
      }
    } else {
      // no payload ask server for new id
      const payload = new Date().getTime()
      console.log(payload)
      // now write this id on the tag
      var message = [
        this.ndef.textRecord(payload.toString()),
      ];
      this.nfc.write(message).then((res) => {
        // create the form for input (new modal)
        this.openCreateModal = true
      }).catch((err) => {
        alert('Issue in writing to NFC')
      })
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

    await this.presentLoading('Scanning NFC...')

    if (info.platform === 'android') {
      this.flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      this.nfc.readerMode(this.flags).subscribe(
        tag => {
          this.tag = JSON.stringify(tag)
          this.performOperation()
          this.loader.dismiss()
        },
        err => {
          alert(JSON.stringify(err))
          this.loader.dismiss()
        })
    } else {
      alert('NFC support not available')
      this.loader.dismiss()
      this.tag = {
        id: 2,
        nDefMessage: []
      }
      this.performOperation()
    }
  }
