import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import {
  CharFieldValidator,
  NoWhiteSpaceValidators,
} from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss'],
})
export class SizeComponent implements OnInit, OnDestroy {
  addForm!: FormGroup;
  buttonText: string = '';
  dbOps!: DbOperation;
  objRows: any[] = [];
  objRow: any;
  formErrors: { [key: string]: string } = {
    name: ''
  };

  validationMessage: {
    [key: string]: { [key: string]: string }
  } = {
      name: {
        required: 'Name is required.',
        minlength: 'Name must be at least 3 characters.',
        maxlength: 'Name must not exceed 50 characters.',
        validcharfield: 'Invalid characters.',
        NoWhiteSpaceValidators: 'Whitespace not allowed.'
      }
    };


  @ViewChild('nav') elnav: any;

  constructor(
    private _http: HttpService,
    private _toaster: ToastrService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setFromState();
    this.getData();
  }

  setFromState() {
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    this.addForm = this._fb.group({
      id: [0],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          CharFieldValidator.validCharfield,
          NoWhiteSpaceValidators.NoWhiteSpace,
        ],
      ],
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    })
  }

  onValueChanges() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = this.addForm.get(field);
      if (control && control.dirty && control.invalid && control.errors) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += message[key] + '';
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

    switch (this.dbOps) {
      case DbOperation.create:
        this._http.post(environment.BASE_API_PATH + 'SizeMaster/Save/', this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record Saved", "Size Master");
            this.resetForm();
            this.getData();
          } else {
            this._toaster.error(res.errors[0], 'Size Master')
          }
        })
        break;

      case DbOperation.update:
        this._http.post(environment.BASE_API_PATH + 'SizeMaster/Update/', this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record Saved", "Size Master");
            this.resetForm();
            this.getData();
          } else {
            this._toaster.error(res.errors[0], 'Size Master')
          }
        })
        break;
    }
  }

  resetForm() {
    this.addForm.reset(
      {
        id: 0,
        name: ''
      }
    );
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    this.elnav.select('viewtab');
  }

  cancelForm() {
    this.addForm.reset(
      {
        id: 0,
        name: ''
      }
    );
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
  }

  edit(id: number) {
    this.buttonText = 'Update';
    this.dbOps = DbOperation.update;
    this.elnav.select('addtab');
    this.objRow = this.objRows.find(x => x.id === id);
    this.addForm.patchValue(this.objRow);
  }

  deleteData(Id: number) {
    let obj = {
      id: Id
    }
    this._http.post(environment.BASE_API_PATH + 'SizeMaster/Delete/', obj).subscribe(res => {
      if (res.isSuccess) {
        this._toaster.success("Record Deleted Successfully", "Size Master");
        this.getData();
      } else {
        this._toaster.error(res.errors[0], 'Size Master')
      }
    })
  }

  getData() {
    this._http.get(environment.BASE_API_PATH + 'SizeMaster/GetAll').subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toaster.error(res.errors[0], 'Size Master')
      }
    })
  }

  tabChange(event: any) {
    this.addForm.reset(
      {
        id: 0,
        name: ''
      }
    );
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    // this.elnav.select('viewtab');
  }

  ngOnDestroy(): void {
    this.objRows = [];
    this.objRow = null
  }
}
