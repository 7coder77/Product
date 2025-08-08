import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { HomePageComponent } from './home-page/home-page.component';



const routes: Routes = [
  { path: '', component: HomePageComponent }
  // { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [
    ProductListComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsModule { }
