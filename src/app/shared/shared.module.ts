import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FeatherIconComponent } from './components/feather-icon/feather-icon.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    FeatherIconComponent,
    BreadCrumbComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    FeatherIconComponent
  ]
})
export class SharedModule { }
