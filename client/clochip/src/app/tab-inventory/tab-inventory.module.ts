import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabInventoryPage } from './tab-inventory.page';
import { ItemModalComponent } from '../modals/item-modal/item-modal.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabInventoryPageRoutingModule } from './tab-inventory-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: TabInventoryPage }]),
    TabInventoryPageRoutingModule
  ],
  declarations: [
    TabInventoryPage,
    ItemModalComponent
  ]
})
export class TabInventoryPageModule {}
