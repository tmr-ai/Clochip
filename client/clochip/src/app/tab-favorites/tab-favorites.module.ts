import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabFavoritesPage } from './tab-favorites.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabFavoritesPageRoutingModule } from './tab-favorites-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabFavoritesPageRoutingModule
  ],
  declarations: [TabFavoritesPage]
})
export class TabFavoritesPageModule {}
