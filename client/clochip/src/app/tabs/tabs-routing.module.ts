import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-washing',
        loadChildren: () => import('../tab-washing/tab-washing.module').then(m => m.TabWashingPageModule)
      },
      {
        path: 'tab-favorites',
        loadChildren: () => import('../tab-favorites/tab-favorites.module').then(m => m.TabFavoritesPageModule)
      },
      {
        path: 'tab-inventory',
        loadChildren: () => import('../tab-inventory/tab-inventory.module').then(m => m.TabInventoryPageModule)
      },
      {
        path: 'tab-dirty',
        loadChildren: () => import('../tab-dirty/tab-dirty.module').then(m => m.TabDirtyPageModule)
      },
      {
        path: 'tab-home',
        loadChildren: () => import('../tab-home/tab-home.module').then(m => m.TabHomePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab-home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
