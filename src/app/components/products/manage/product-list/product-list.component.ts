import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  objRows: any[] = [];

  constructor(
    private _http: HttpService,
    private _toaster: ToastrService,
    private _router: Router
  ) { }


  ngOnInit() {
    this.getData();
  }

  getData() {
    this._http.get(environment.BASE_API_PATH + 'ProductMaster/GetAll').subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toaster.error(res.errors[0], 'Product List')
      }
    })
  }

  edit(id: number) {
    this._router.navigate(['/products/manage/add-product'], { queryParams: { productId: id } });
  }

  deleteData(Id: number) {
    let obj = {
      id: Id
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    this._http.post(environment.BASE_API_PATH + 'ProductMaster/Delete/', obj).subscribe(res => {
      if (res.isSuccess) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your record has been deleted.',
          'success'
        )
        this._toaster.success("Record Deleted Successfully", "Product List");
        this.getData();
      } else {
        this._toaster.error(res.errors[0], 'Product List')
      }
    })
  }
}
