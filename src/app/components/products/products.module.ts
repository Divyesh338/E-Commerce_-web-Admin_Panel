import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { AddProductsComponent } from './manage/add-products/add-products.component';
import { ProductListComponent } from './manage/product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CKEditorModule } from "ckeditor4-angular";

@NgModule({
  declarations: [
    AddProductsComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FormsModule,
    CKEditorModule
]
})
export class ProductsModule { }
