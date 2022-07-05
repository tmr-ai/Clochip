import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabOutfitPage } from './tab-outfit.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabOutfitPageRoutingModule } from './tab-outfit-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabOutfitPageRoutingModule
  ],
  declarations: [TabOutfitPage]
})
export class TabOutfitPageModule {}
