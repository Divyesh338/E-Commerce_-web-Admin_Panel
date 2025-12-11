import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { MustMatchValidator } from 'src/app/shared/validations/validations.validator';
import { Global } from 'src/app/shared/utility/global';
import { environment } from 'src/environments/environment';
import { DbOperation } from 'src/app/shared/utility/db-operation';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent {
  addUserForm!: FormGroup;
  userId: number = 0;
  submitted: boolean = false;
  apiUrl = Global.BASE_API_PATH || '';
  objUserType: any[] = [];
  buttonText: string = 'Register';
  dbOps!: DbOperation;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _toaster: ToastrService,
    private _http: HttpService,
    private _router: Router
  ) {
    this._activeRoute.queryParams.subscribe(params => {
      this.userId = params['userId']
    })
  }

  ngOnInit(): void {
    this.setRegisterForm();
    this.getUserTypes();

    if (this.userId > 0 && this.userId != null) {
      this.buttonText = 'Update';
      this.dbOps = DbOperation.update;
      this.getUserById(this.userId);
    }
  }

  setRegisterForm() {
    this.dbOps = DbOperation.create;
    this.buttonText = "Add";
    this.addUserForm = new FormGroup({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      userTypeId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])),
      confirmPassword: new FormControl('', Validators.required),
    }, MustMatchValidator('password', 'confirmPassword')
    )
  }

  get ctrl() {
    return this.addUserForm.controls;
  }


  getUserById(id: number) {
    this._http.get(environment.BASE_API_PATH + 'UserMaster/GetbyId/' + id).subscribe(res => {
      if (res.isSuccess) {
        this.addUserForm.patchValue(res.data);
      } else {
        this._toaster.error(res.errors[0], 'Add User');
      }
    })
  }

  getUserTypes() {
    this._http.get(environment.BASE_API_PATH + 'UserType/GetAll').subscribe(res => {
      if (res.isSuccess) {
        this.objUserType = res.data;
      } else {
        this._toaster.error(res.errors[0], 'Add User')
      }
    })
  }

  register() {
    this.submitted = true;
    debugger;
    switch (this.dbOps) {
      case DbOperation.create:
        this._http.postImage(environment.BASE_API_PATH + 'UserMaster/Save/', this.addUserForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record Saved", "Add User");
            this.resetForm();
            this._router.navigate(['users/list-user']);
            this.getUserTypes();
          } else {
            this._toaster.error(res.errors[0], 'Add User')
          }
        })
        break;

      case DbOperation.update:
        this._http.postImage(environment.BASE_API_PATH + 'UserMaster/Update/', this.addUserForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record Saved", "Add User");
            this.resetForm();
            this._router.navigate(['users/list-user']);
            this.getUserTypes();
          } else {
            this._toaster.error(res.errors[0], 'UserMaster Master')
          }
        })
        break;
    }
  }

  resetForm() {
    this.addUserForm.reset();
    this.submitted = false;
    this.buttonText = 'add';
    this.dbOps = DbOperation.create;
  }

  cancel() {
    this.resetForm();
    this._router.navigate(['user/list-user']);
  }
}
