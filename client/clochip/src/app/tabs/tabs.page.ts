import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  readerMode$
  constructor(private nfc: NFC, private ndef: Ndef, public alertController: AlertController) {}

  

  async read() {
    // Read NFC Tag - Android
    // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
    let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    this.readerMode$ = this.nfc.readerMode(flags).subscribe(
        tag => console.log(JSON.stringify(tag)),
        err => console.log('Error reading tag', err)
    );

    // Read NFC Tag - iOS
    // On iOS, a NFC reader session takes control from your app while scanning tags then returns a tag
    try {
      let tag = await this.nfc.scanNdef();
      console.log(JSON.stringify(tag));
    } catch (err) {
        console.log('Error reading tag', err);
    }
  }
  

}
