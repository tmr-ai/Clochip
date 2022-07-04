import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabOutfitPage } from './tab-outfit.page';

const routes: Routes = [
  {
    path: '',
    component: TabOutfitPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabOutfitPageRoutingModule {}
