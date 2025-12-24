import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { BrandLogoComponent } from './brand-logo/brand-logo.component';
import { CategoryComponent } from './category/category.component';
import { SizeComponent } from './size/size.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { TagComponent } from './tag/tag.component';
import { ColorComponent } from './color/color.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    BrandLogoComponent,
    CategoryComponent,
    SizeComponent,
    UserTypeComponent,
    TagComponent,
    ColorComponent,
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgxDatatableModule,
  ],
})
export class MastersModule {}
