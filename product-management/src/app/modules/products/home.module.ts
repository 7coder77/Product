import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
// import { MaterialModule} from '@shared/material.module';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'products',loadChildren: () =>
      import('./products-home/products-home.module').then(m => m.ProductsHomeModule) },
  { path: 'price',loadChildren: () =>
      import('./price-home/price-home.module').then(m => m.PriceHomeModule)
   }
  // { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
