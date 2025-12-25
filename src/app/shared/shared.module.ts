import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FeatherIconComponent } from './components/feather-icon/feather-icon.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { CountToModule } from 'angular-count-to';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { AdminLayoutComponent } from './components/layout/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './components/layout/auth-layout/auth-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    FeatherIconComponent,
    BreadCrumbComponent,
    LayoutComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AgGridModule,
    CountToModule,
    Ng2GoogleChartsModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  exports: [
    FeatherIconComponent,
    AgGridModule,
    CountToModule,
    Ng2GoogleChartsModule,
    ToastrModule,
    HttpClientModule
  ],
})
export class SharedModule {}
