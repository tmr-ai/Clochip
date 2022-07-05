import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabDirtyPage } from './tab-dirty.page';

const routes: Routes = [
  {
    path: '',
    component: TabDirtyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabDirtyPageRoutingModule {}
