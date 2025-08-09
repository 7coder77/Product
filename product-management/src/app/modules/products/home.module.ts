import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
// import { MaterialModule} from '@shared/material.module';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent,canActivate: [AuthGuard] },
  { path: 'products',loadChildren: () =>
      import('./products-home/products-home.module').then(m => m.ProductsHomeModule),canActivate: [AuthGuard] },
  { path: 'price',loadChildren: () =>
      import('./price-home/price-home.module').then(m => m.PriceHomeModule),canActivate: [AuthGuard]
   }
  // { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [
    HomePageComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
