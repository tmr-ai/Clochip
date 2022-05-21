import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabFavoritesPage } from './tab-favorites.page';

const routes: Routes = [
  {
    path: '',
    component: TabFavoritesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabFavoritesPageRoutingModule {}
