import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabDirtyPageRoutingModule } from './tab-dirty-routing.module';

import { TabDirtyPage } from './tab-dirty.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabDirtyPageRoutingModule
  ],
  declarations: [TabDirtyPage]
})
export class TabDirtyPageModule {}
