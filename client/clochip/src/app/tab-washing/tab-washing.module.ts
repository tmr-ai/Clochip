import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabWashingPage } from './tab-washing.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabWashingPageRoutingModule } from './tab-washing-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabWashingPageRoutingModule
  ],
  declarations: [TabWashingPage]
})
export class TabWashingPageModule {}
