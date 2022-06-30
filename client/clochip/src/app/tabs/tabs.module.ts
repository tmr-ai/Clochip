import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';


import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {
  [x: string]: any;


 constructor(private nfc: NFC, private ndef: Ndef) { }




read_nfc(){
  // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
   let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
   this.readerMode$ = this.nfc.readerMode(flags).subscribe(
       tag => console.log(JSON.stringify(tag)),
       err => console.log('Error reading tag', err)
   );

   }








}
