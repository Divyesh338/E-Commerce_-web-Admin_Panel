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
  selector: 'app-brand-logo',
  templateUrl: './brand-logo.component.html',
  styleUrls: ['./brand-logo.component.scss'],
})
export class BrandLogoComponent implements OnInit, OnDestroy {
  addForm!: FormGroup;
  buttonText: string = '';
  dbOps!: DbOperation;
  objRows: any[] = [];
  objRow: any;
  addedImagePath: string | undefined = 'assets/images/radhe.png';
  fileToUpload: any;
  formErrors: { [key: string]: string } = {
    name: '',
  };

  validationMessage: {
    [key: string]: { [key: string]: string };
  } = {
    name: {
      required: 'Name is required.',
      minlength: 'Name must be at least 3 characters.',
      maxlength: 'Name must not exceed 50 characters.',
      validcharfield: 'Invalid characters.',
      NoWhiteSpaceValidators: 'Whitespace not allowed.',
    },
  };

  @ViewChild('nav') elnav: any;

  constructor(
    private _http: HttpService,
    private _toaster: ToastrService,
    private _fb: FormBuilder
  ) {}

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
    });
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

    if (this.dbOps === DbOperation.create && !this.fileToUpload) {
      this._toaster.error('Please upload a image', 'Branch logo master');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.addForm.value.id);
    formData.append('name', this.addForm.value.name);
    formData.append('image', this.fileToUpload, this.fileToUpload.name);
    switch (this.dbOps) {
      case DbOperation.create:
        this._http
          .postImage(environment.BASE_API_PATH + 'BrandLogo/Save/', formData)
          .subscribe((res) => {
            if (res.isSuccess) {
              this._toaster.success('Record Saved', 'BrandLogo Master');
              this.resetForm();
              this.getData();
            } else {
              this._toaster.error(res.errors[0], 'BrandLogo Master');
            }
          });
        break;

      case DbOperation.update:
        this._http
          .postImage(environment.BASE_API_PATH + 'BrandLogo/Update/', formData)
          .subscribe((res) => {
            if (res.isSuccess) {
              this._toaster.success('Record Saved', 'BrandLogo Master');
              this.resetForm();
              this.getData();
            } else {
              this._toaster.error(res.errors[0], 'BrandLogo Master');
            }
          });
        break;
    }
  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: '',
    });
    this.buttonText = 'Add';
    this.addedImagePath = 'assets/images/radhe.png';
    this.dbOps = DbOperation.create;
    this.elnav.select('viewtab');
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
    });
    this.buttonText = 'Add';
    this.addedImagePath = 'assets/images/radhe.png';
    this.dbOps = DbOperation.create;
  }

  edit(id: number) {
    this.buttonText = 'Update';
    this.dbOps = DbOperation.update;
    this.elnav.select('addtab');
    this.objRow = this.objRows.find((x) => x.id === id);
    this.addedImagePath = this.objRow.imagePath;
    this.addForm.patchValue(this.objRow);
  }

  deleteData(Id: number) {
    let obj = {
      id: Id,
    };
    this._http
      .post(environment.BASE_API_PATH + 'BrandLogo/Delete/', obj)
      .subscribe((res) => {
        if (res.isSuccess) {
          this._toaster.success(
            'Record Deleted Successfully',
            'BrandLogo Master'
          );
          this.getData();
        } else {
          this._toaster.error(res.errors[0], 'BrandLogo Master');
        }
      });
  }

  getData() {
    this._http
      .get(environment.BASE_API_PATH + 'BrandLogo/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objRows = res.data;
        } else {
          this._toaster.error(res.errors[0], 'BrandLogo Master');
        }
      });
  }

  tabChange(event: any) {
    this.addForm.reset({
      id: 0,
      name: '',
    });
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
  }

  upload(files: any) {
    if (!files.length) {
      return;
    }

    let type = files[0].type;

    if (type.match(/image\/*/) == null) {
      this._toaster.error('Please upload a valid Image', 'Brand logo master');
      this.addedImagePath = 'assets/images/radhe.png';
    }

    this.fileToUpload = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result?.toString();
    };
  }

  ngOnDestroy(): void {
    this.objRows = [];
    this.objRow = null;
  }
}
