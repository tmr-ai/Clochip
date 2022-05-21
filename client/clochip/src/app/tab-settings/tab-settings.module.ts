import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabSettingsPageRoutingModule } from './tab-settings-routing.module';

import { TabSettingsPage } from './tab-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabSettingsPageRoutingModule
  ],
  declarations: [TabSettingsPage]
})
export class TabSettingsPageModule {}
