import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabHomePageRoutingModule } from './tab-home-routing.module';

import { TabHomePage } from './tab-home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { RouterModule } from '@angular/router';

import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';


@NgModule({
  imports: [

    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: TabHomePage }]),
    TabHomePageRoutingModule
  ],
  declarations: [TabHomePage]
})
export class TabHomePageModule {}
