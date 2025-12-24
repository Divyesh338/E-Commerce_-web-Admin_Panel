import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import {
  CharFieldValidator,
  NoWhiteSpaceValidators,
  NumericFieldValidators,
} from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-Category',
  templateUrl: './Category.component.html',
  styleUrls: ['./Category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  addForm!: FormGroup;
  buttonText: string = '';
  dbOps!: DbOperation;
  objRows: any[] = [];
  objRow: any;
  addedImagePath: string | undefined = 'assets/images/radhe.png';
  fileToUpload: any;
  formErrors: { [key: string]: string } = {
    name: '',
    title: '',
    isSave: '',
    link: '',
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
      },
      title: {
        required: 'title is required.',
        minlength: 'title must be at least 3 characters.',
        maxlength: 'title must not exceed 50 characters.',
        validcharfield: 'Invalid characters.',
        NoWhiteSpaceValidators: 'Whitespace not allowed.'
      },
      isSave: {
        required: 'isSave is required.',
        minlength: 'isSave must be at least 3 characters.',
        maxlength: 'isSave must not exceed 50 characters.',
        validcharfield: 'Invalid characters.',
        NoWhiteSpaceValidators: 'Whitespace not allowed.'
      },
      link: {
        required: 'link is required.',
        minlength: 'link must be at least 3 characters.',
        maxlength: 'link must not exceed 50 characters.',
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
    console.log(this.addForm);
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
          Validators.maxLength(19),
          CharFieldValidator.validCharfield,
          NoWhiteSpaceValidators.NoWhiteSpace,
        ],

      ],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(17),
          CharFieldValidator.validCharfield,
          NoWhiteSpaceValidators.NoWhiteSpace,
        ],
      ],
      isSave: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          NumericFieldValidators.validNumericfield,
          NoWhiteSpaceValidators.NoWhiteSpace,
        ],
      ],
      link: [
        '',
        [
          // Validators.required,
          // Validators.minLength(5),
          // Validators.maxLength(200),
          // NumericFieldValidators.validNumericfield,
          // NoWhiteSpaceValidators.NoWhiteSpace,
        ],
      ],
    });
    console.log(this.addForm);
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
    console.log(this.addForm);
    if (this.addForm.invalid) {
      return;
    }

    if (this.dbOps === DbOperation.create && !this.fileToUpload) {
      this._toaster.error('Please upload a image', "Category master");
      return;
    }

    const formData = new FormData();
    formData.append('id', this.addForm.value.id);
    formData.append('name', this.addForm.value.name);
    formData.append('title', this.addForm.value.title);
    formData.append('IsSave', this.addForm.value.isSave);
    formData.append('link', this.addForm.value.link);

    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload, this.fileToUpload.name);
    }
    
    switch (this.dbOps) {
      case DbOperation.create:
        this._http.postImage(environment.BASE_API_PATH + 'Category/Save/', formData).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record Saved", "Category Master");
            this.resetForm();
            this.getData();
          } else {
            this._toaster.error(res.errors[0], 'Category Master')
          }
        })
        break;

      case DbOperation.update:
        this._http.postImage(environment.BASE_API_PATH + 'Category/Update/', formData).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record Saved", "Category Master");
            this.resetForm();
            this.getData();
          } else {
            this._toaster.error(res.errors[0], 'Category Master')
          }
        })
        break;
    }
  }

  resetForm() {
    this.addForm.reset(
      {
        id: 0,
        name: '',
        title: '',
        link: '',
        isSave: ''
      }
    );
    this.buttonText = 'Add';
    this.addedImagePath = 'assets/images/radhe.png';
    this.dbOps = DbOperation.create;
    this.elnav.select('viewtab');
  }

  cancelForm() {
    this.addForm.reset(
      {
        id: 0,
        name: '',
        title: '',
        link: '',
        isSave: ''
      }
    );
    this.buttonText = 'Add';
    this.addedImagePath = 'assets/images/radhe.png';
    this.dbOps = DbOperation.create;
  }

  edit(id: number) {
    this.buttonText = 'Update';
    this.dbOps = DbOperation.update;
    this.elnav.select('addtab');
    this.objRow = this.objRows.find(x => x.id === id);
    this.addedImagePath = this.objRow.imagePath;
    this.addForm.patchValue(this.objRow);
  }

  deleteData(Id: number) {
    let obj = {
      id: Id
    }
    this._http.post(environment.BASE_API_PATH + 'Category/Delete/', obj).subscribe(res => {
      if (res.isSuccess) {
        this._toaster.success("Record Deleted Successfully", "Category Master");
        this.getData();
      } else {
        this._toaster.error(res.errors[0], 'Category Master')
      }
    })
  }

  getData() {
    this._http.get(environment.BASE_API_PATH + 'Category/GetAll').subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toaster.error(res.errors[0], 'Category Master')
      }
    })
  }

  tabChange(event: any) {
    this.addForm.reset(
      {
        id: 0,
        name: '',
        title: '',
        link: '',
        isSave: ''
      }
    );
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
  }

  upload(files: any) {
    console.log(files);
    if (!files.length) {
      return;
    }

    let type = files[0].type

    if (type.match(/image\/*/) == null) {
      this._toaster.error('Please upload a valid Image', "Brand logo master");
      this.addedImagePath = 'assets/images/radhe.png';
    }

    this.fileToUpload = files[0];

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result?.toString();
    }
  }

  ngOnDestroy(): void {
    this.objRows = [];
    this.objRow = null
  }
}
