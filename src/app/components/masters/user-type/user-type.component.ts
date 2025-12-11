import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import { CharFieldValidator, NoWhiteSpaceValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss']
})
export class UserTypeComponent implements OnInit, OnDestroy {
  addForm!: FormGroup;
  buttonTex!: string;
  dbops!: DbOperation;
  objRows: any[] = [];
  objRow: any;

  @ViewChild('nav') elnav: any;

  formErrors: { [key: string]: string } = {
    name: ""
  };


  validationMessage: { [key: string]: { [key: string]: string } } = {
    name: {
      required: 'Name is required',
      minlength: 'Min 3 chars',
      maxlength: 'Max 10 chars',
      validCharfield: 'Invalid',
      NoWhiteSpace: 'No spaces'
    }
  };


  constructor(private _httpService: HttpService, private _toastr: ToastrService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  setFormState() {
    this.buttonTex = "Add";
    this.dbops = DbOperation.create;

    this.addForm = this._fb.group({
      id: [0],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        CharFieldValidator.validCharfield,
        NoWhiteSpaceValidators.NoWhiteSpace
      ]]
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    });
  }

  onValueChanges() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";

      const control = this.addForm.get(field);

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors ?? {})) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + " ";
          }
        }
      }
    }
  }

  get ctrl() {
    return this.addForm.controls;
  }

  Submit() {
    if (this.addForm.invalid) {
      return;
    }

    switch (this.dbops) {
      case DbOperation.create:
        this._httpService.post(environment.BASE_API_PATH + "UserType/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record Saved !!", "User Type Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "UserType Master");
          }
        });
        break;
      case DbOperation.update:
        this._httpService.post(environment.BASE_API_PATH + "UserType/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record Updated !!", "UserType Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "UserType Master");
          }
        });
        break;
    }

  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: ''
    });

    this.buttonTex = "Add";
    this.dbops = DbOperation.create;
    this.getData();
    this.elnav.select('viewtab');
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: ''
    });

    this.buttonTex = "Add";
    this.dbops = DbOperation.create;
    this.elnav.select('viewtab');
  }

  getData() {
    this._httpService.get(environment.BASE_API_PATH + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
        debugger;
      } else {
        this._toastr.error(res.errors[0], "UserType Master");
      }
    });
  }

  Edit(id: number) {
    this.buttonTex = "Update";
    this.dbops = DbOperation.update;
    this.elnav.select('addtab');

    this.objRow = this.objRows.find(x => x.id === id);
    this.addForm.patchValue(this.objRow);
  }


  Delete(id: number) {
    let obj = {
      id: id
    };

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._httpService.post(environment.BASE_API_PATH + "UserType/Delete/", obj).subscribe(res => {
          if (res.isSuccess) {
            //this._toastr.success("Record Deleted !!", "UserType Master");
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            this.getData();
          } else {
            this._toastr.error(res.errors[0], "UserType Master");
          }
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your record is safe :)',
          'error'
        )
      }
    })


  }

  ngOnDestroy() {
    this.objRows = [];
    this.objRow = null;
  }

  tabChange(event: any) {
    this.addForm.reset({
      id: 0,
      name: ''
    });

    this.buttonTex = "Add";
    this.dbops = DbOperation.create;
  }

}