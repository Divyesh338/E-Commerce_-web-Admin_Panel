import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import { CharFieldValidator, NoWhiteSpaceValidators, NumericFieldValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit, OnDestroy {
  productId: number = 0;
  addForm!: FormGroup;
  submitted: boolean = false;
  dbops!: DbOperation;
  buttonText: string = "";

  objSizes: any[] = [];
  objColors: any[] = [];
  objTags: any[] = [];
  objCategories: any[] = [];

  bigImage = "assets/images/product-noimage.jpg";
  images = [
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" }
  ];

  // store actual File objects in the index positions that user uploaded to
  fileToUpload: Array<File | null> = [null, null, null, null, null];
  counter: number = 1;
  @ViewChild('file') elfile!: ElementRef<HTMLInputElement>;

  // number of images already present on server for current product (used during update)
  existingImagesCount: number = 0;

  formErrors: { [key: string]: string } = {
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',
    colorId: '',
    categoryId: '',
    tagId: ''
  };

  validationMessage: {
    [key: string]: { [key: string]: string }
  } = {
      name: {
        required: 'Name is required',
        minlength: 'Name cannot be less than 3 char long',
        maxlength: 'Name cannot be more than 20 char long',
        validCharField: 'Name must contain letters and spaces only',
        noWhiteSpaceValidator: 'Only whitespace is not allowed'
      },
      title: {
        required: 'Title is required',
        minlength: 'Title cannot be less than 3 char long',
        maxlength: 'Title cannot be more than 20 char long',
        validCharField: 'Title must contain letters and spaces only',
        noWhiteSpaceValidator: 'Only whitespace is not allowed'
      },
      code: {
        required: 'Code is required',
        minlength: 'Code cannot be less than 3 char long',
        maxlength: 'Code cannot be more than 20 char long',
        noWhiteSpaceValidator: 'Only whitespace is not allowed'
      },
      price: {
        required: 'Price is required',
        minlength: 'Price cannot be less than 1 char long',
        maxlength: 'Price cannot be more than 4 char long',
        validNumericField: 'Price must contain numbers only',
        noWhiteSpaceValidator: 'Only whitespace is not allowed'
      },
      salePrice: {
        required: 'Sale Price is required',
        minlength: 'Sale Price cannot be less than 1 char long',
        maxlength: 'Sale Price cannot be more than 4 char long',
        validNumericField: 'Sale Price must contain numbers only',
        noWhiteSpaceValidator: 'Only whitespace is not allowed'
      },
      discount: {
        required: 'Discount is required',
        minlength: 'Discount cannot be less than 1 char long',
        maxlength: 'Discount cannot be more than 4 char long',
        validNumericField: 'Discount must contain numbers only',
        noWhiteSpaceValidator: 'Only whitespace is not allowed'
      },
      sizeId: {
        required: 'Size is required'
      },
      colorId: {
        required: 'Color is required'
      },
      tagId: {
        required: 'Tag is required'
      },
      categoryId: {
        required: 'Category is required'
      }
    };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _httpService: HttpService,
    private _toastr: ToastrService,
    private _fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.productId = +params['productId'] || 0;
    });
  }

  ngOnInit(): void {
    this.setFormState();
    this.getCategories();
    this.getColors();
    this.getSizes();
    this.getTags();

    if (this.productId && this.productId > 0) {
      this.buttonText = "Update";
      this.dbops = DbOperation.update;
      this.getProductById(this.productId);
    }
  }

  setFormState() {
    this.buttonText = "Add";
    this.dbops = DbOperation.create;

    this.addForm = this._fb.group({
      id: [0],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        CharFieldValidator.validCharfield,
        NoWhiteSpaceValidators.NoWhiteSpace
      ]],
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        CharFieldValidator.validCharfield,
        NoWhiteSpaceValidators.NoWhiteSpace
      ]],
      code: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        NoWhiteSpaceValidators.NoWhiteSpace
      ]],
      price: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
        NumericFieldValidators.validNumericfield,
        NoWhiteSpaceValidators.NoWhiteSpace
      ]],
      salePrice: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
        NumericFieldValidators.validNumericfield,
        NoWhiteSpaceValidators.NoWhiteSpace
      ]],
      discount: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
        NumericFieldValidators.validNumericfield,
        NoWhiteSpaceValidators.NoWhiteSpace
      ]],
      sizeId: ['', Validators.required],
      colorId: ['', Validators.required],
      tagId: ['', Validators.required],
      categoryId: ['', Validators.required],
      quantity: [''],
      isSale: [false],
      isNew: [false],
      shortDetails: [''],
      description: ['']
    });

    // subscribe to changes for validation messages
    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    });

    this.counter = 1;
    this.addForm.get('quantity')!.setValue(this.counter);
  }

  onValueChanges() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";

      const control = this.addForm.get(field);

      if (!control) {
        continue;
      }

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field] || {};
        const errors = control.errors ?? {};

        // include required and other error keys
        for (const key of Object.keys(errors)) {
          const msg = message[key];
          if (msg) {
            this.formErrors[field] += msg + " ";
          } else {
            // fallback generic messages
            if (key === 'required') {
              this.formErrors[field] += 'This field is required. ';
            } else {
              this.formErrors[field] += key + ' ';
            }
          }
        }
      }
    }
  }

  getProductById(id: number) {
    this._httpService.get(environment.BASE_API_PATH + "ProductMaster/GetbyId/" + id).subscribe(res => {
      if (res.isSuccess && res.data) {
        // patch values safely
        const data = res.data;
        // ensure numbers/booleans are normalized
        const patch = {
          id: data.id ?? 0,
          name: data.name ?? '',
          title: data.title ?? '',
          code: data.code ?? '',
          price: data.price ?? '',
          salePrice: data.salePrice ?? '',
          discount: data.discount ?? '',
          sizeId: data.sizeId ?? '',
          colorId: data.colorId ?? '',
          categoryId: data.categoryId ?? '',
          tagId: data.tagId ?? '',
          quantity: data.quantity ?? 1,
          isSale: data.isSale === 1,
          isNew: data.isNew === 1,
          shortDetails: data.shortDetails ?? '',
          description: data.description ?? ''
        };

        this.addForm.patchValue(patch);

        this.counter = patch.quantity ?? 1;
        this.addForm.get('quantity')!.setValue(this.counter);

        // fetch product pictures - do defensive checks
        this._httpService.get(environment.BASE_API_PATH + "ProductMaster/GetProductPicturebyId/" + id).subscribe(picRes => {
          if (picRes.isSuccess && Array.isArray(picRes.data)) {
            const pics = picRes.data;
            // set existingImagesCount = number of valid image names present
            this.existingImagesCount = pics.filter((p: any) => p && p.name).length;

            // build images array ensuring 5 entries
            const newImages = [0, 1, 2, 3, 4].map(i => {
              if (pics[i] && pics[i].name) {
                return { img: environment.BASE_IMAGES_PATH + pics[i].name };
              } else {
                return { img: "assets/images/noimage.png" };
              }
            });

            this.images = newImages;

            // set bigImage to first real image if exists
            const firstValid = pics.find((p: any) => p && p.name);
            this.bigImage = firstValid ? (environment.BASE_IMAGES_PATH + firstValid.name) : "assets/images/product-noimage.jpg";

          } else {
            // if pictures endpoint returns failure, keep defaults and notify
            // avoid spamming error: only show if message present
            if (picRes.errors && picRes.errors.length > 0) {
              this._toastr.error(picRes.errors[0], "Product Images");
            }
          }
        });

      } else {
        if (res.errors && res.errors.length > 0) {
          this._toastr.error(res.errors[0], "Get Product");
        } else {
          this._toastr.error("Failed to load product.", "Get Product");
        }
      }
    }, err => {
      this._toastr.error("Server error while fetching product.", "Get Product");
    });
  }

  getSizes() {
    this._httpService.get(environment.BASE_API_PATH + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objSizes = res.data ?? [];
      } else {
        this._toastr.error(res.errors?.[0] ?? "Failed to load sizes", "Add Product");
      }
    }, _ => this._toastr.error("Server error while fetching sizes", "Add Product"));
  }

  getTags() {
    this._httpService.get(environment.BASE_API_PATH + "TagMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objTags = res.data ?? [];
      } else {
        this._toastr.error(res.errors?.[0] ?? "Failed to load tags", "Add Product");
      }
    }, _ => this._toastr.error("Server error while fetching tags", "Add Product"));
  }

  getColors() {
    this._httpService.get(environment.BASE_API_PATH + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objColors = res.data ?? [];
      } else {
        this._toastr.error(res.errors?.[0] ?? "Failed to load colors", "Add Product");
      }
    }, _ => this._toastr.error("Server error while fetching colors", "Add Product"));
  }

  getCategories() {
    this._httpService.get(environment.BASE_API_PATH + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objCategories = res.data ?? [];
      } else {
        this._toastr.error(res.errors?.[0] ?? "Failed to load categories", "Add Product");
      }
    }, _ => this._toastr.error("Server error while fetching categories", "Add Product"));
  }

  get ctrl() {
    return this.addForm.controls;
  }

  /**
   * Upload handler
   * files: FileList
   * i: index 0..4
   */
  upload(files: FileList | null, i: number) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!file) {
      return;
    }

    const type = file.type || '';
    if (!type.match(/image\/*/)) {
      this._toastr.error("Please Upload a Valid Image !!", "Add Product");
      if (this.elfile && this.elfile.nativeElement) {
        this.elfile.nativeElement.value = "";
      }
      // keep previous image unchanged
      return;
    }

    // store file at index i
    this.fileToUpload[i] = file;

    // read and preview
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result;
        if (typeof result === 'string') {
          this.images[i].img = result;
          this.bigImage = result;
        }
      } catch (e) {
        // ignore read errors
      }
    };
    reader.readAsDataURL(file);
  }

  increment() {
    this.counter = this.counter + 1;
    this.addForm.get('quantity')!.setValue(this.counter);
  }

  decrement() {
    if (this.counter > 1) {
      this.counter = this.counter - 1;
      this.addForm.get('quantity')!.setValue(this.counter);
    }
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      sizeId: '',
      colorId: '',
      categoryId: '',
      tagId: '',
      quantity: '',
      isSale: false,
      isNew: false,
      shortDetails: '',
      description: ''
    });

    this.buttonText = "Add";
    this.dbops = DbOperation.create;

    this.bigImage = "assets/images/product-noimage.jpg";
    this.images = [
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" }
    ];

    this.fileToUpload = [null, null, null, null, null];
    this.existingImagesCount = 0;
    this.counter = 1;
    this.router.navigate(['/products/manage/product-list']);
  }

  /**
   * Count how many valid File objects user uploaded (non-null)
   */
  private countValidUploads(): number {
    return this.fileToUpload.filter(f => f instanceof File).length;
  }

  Submit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      this.onValueChanges(); // populate error messages
      return;
    }

    // If creating a product require 5 images uploaded
    // If updating, allow update when:
    //   - Either the existing server images are already 5 OR
    //   - user uploads 5 images OR
    //   - user uploads enough images to reach total 5 with existingImagesCount
    const uploadedCount = this.countValidUploads();
    const totalImagesAvailable = this.existingImagesCount + uploadedCount;

    if (this.dbops === DbOperation.create && uploadedCount < 5) {
      this._toastr.error("Please upload 5 images per product!", "Add Product");
      return;
    } else if (this.dbops === DbOperation.update) {
      if (this.existingImagesCount === 0 && uploadedCount < 5) {
        // no images on server & user didn't upload 5 images
        this._toastr.error("Please upload 5 images per product or keep existing 5 images on server!", "Add Product");
        return;
      }
      if (totalImagesAvailable < 5) {
        this._toastr.error(`You must provide total 5 images (existing: ${this.existingImagesCount}, uploaded: ${uploadedCount}).`, "Add Product");
        return;
      }
    }

    const formData = new FormData();
    formData.append("Id", String(this.addForm.value.id ?? 0));
    formData.append("Name", String(this.addForm.value.name ?? ''));
    formData.append("Title", String(this.addForm.value.title ?? ''));
    formData.append("Code", String(this.addForm.value.code ?? ''));
    formData.append("Price", String(this.addForm.value.price ?? ''));
    formData.append("SalePrice", String(this.addForm.value.salePrice ?? ''));
    formData.append("Discount", String(this.addForm.value.discount ?? ''));
    formData.append("Quantity", String(this.addForm.value.quantity ?? this.counter));
    // backend in your code expects isSale/isNew as 1/0 numeric (you compared to 1 earlier)
    formData.append("IsSale", this.addForm.value.isSale ? "1" : "0");
    formData.append("IsNew", this.addForm.value.isNew ? "1" : "0");
    formData.append("SizeId", String(this.addForm.value.sizeId ?? ''));
    formData.append("ColorId", String(this.addForm.value.colorId ?? ''));
    formData.append("CategoryId", String(this.addForm.value.categoryId ?? ''));
    formData.append("TagId", String(this.addForm.value.tagId ?? ''));
    formData.append("ShortDetails", String(this.addForm.value.shortDetails ?? ''));
    formData.append("Description", String(this.addForm.value.description ?? ''));

    // append each uploaded file (only valid File objects)
    for (let i = 0; i < this.fileToUpload.length; i++) {
      const f = this.fileToUpload[i];
      if (f instanceof File) {
        // append with same form name expected by backend
        formData.append("Image", f, f.name);
      }
    }

    // call backend depending on operation
    if (this.dbops === DbOperation.create) {
      this._httpService.postImage(environment.BASE_API_PATH + "ProductMaster/Save/", formData).subscribe(res => {
        if (res.isSuccess) {
          this._toastr.success("Record Saved !!", "Add Product");
          this.cancelForm();
        } else {
          this._toastr.error(res.errors?.[0] ?? "Failed to save product", "Add Product");
        }
      }, _ => this._toastr.error("Server error while saving product", "Add Product"));
    } else if (this.dbops === DbOperation.update) {
      this._httpService.postImage(environment.BASE_API_PATH + "ProductMaster/Update/", formData).subscribe(res => {
        if (res.isSuccess) {
          this._toastr.success("Record Updated !!", "Add Product");
          this.cancelForm();
        } else {
          this._toastr.error(res.errors?.[0] ?? "Failed to update product", "Add Product");
        }
      }, _ => this._toastr.error("Server error while updating product", "Add Product"));
    }
  }

  ngOnDestroy() {
    this.objSizes = [];
    this.objColors = [];
    this.objTags = [];
    this.objCategories = [];
    this.fileToUpload = [null, null, null, null, null];
  }
}
