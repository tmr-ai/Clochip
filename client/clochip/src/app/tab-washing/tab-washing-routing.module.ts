import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabWashingPage } from './tab-washing.page';

const routes: Routes = [
  {
    path: '',
    component: TabWashingPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabWashingPageRoutingModule {}
