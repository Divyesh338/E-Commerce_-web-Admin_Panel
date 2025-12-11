import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
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
    this._http.get(environment.BASE_API_PATH + 'UserMaster/GetAll').subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toaster.error(res.errors[0], 'Size Master')
      }
    })
  }

  edit(id: number) {
    this._router.navigate(['/users/add-user'], { queryParams: { userId: id } });
  }

  deleteData(Id: number) {
    let obj = {
      id: Id
    }
    this._http.post(environment.BASE_API_PATH + 'UserMaster/Delete/', obj).subscribe(res => {
      if (res.isSuccess) {
        this._toaster.success("Record Deleted Successfully", "Size Master");
        this.getData();
      } else {
        this._toaster.error(res.errors[0], 'Size Master')
      }
    })
  }
}
