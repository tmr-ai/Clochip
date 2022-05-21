import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab-washing/tab-washing.module').then(m => m.TabWashingPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab-favorites/tab-favorites.module').then(m => m.TabFavoritesPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab-inventory/tab-inventory.module').then(m => m.TabInventoryPageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab-settings/tab-settings.module').then(m => m.TabSettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
