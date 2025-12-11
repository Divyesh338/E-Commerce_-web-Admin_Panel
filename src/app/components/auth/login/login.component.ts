import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';
import { MustMatchValidator } from 'src/app/shared/validations/validations.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  submitted: boolean = false;
  activeTab = 'registertab';
  @ViewChild('ngbNav') elnav: any;
  apiUrl = Global.BASE_API_PATH || '';

  constructor(
    private fb: FormBuilder,
    private _toaster: ToastrService,
    private _http: HttpService,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.setLoginForm();
    this.setRegisterForm()
  }

  setLoginForm() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  // setRegisterForm() {
  //   this.registerForm = this.fb.group({
  //     firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
  //     lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
  //     email: ['', Validators.compose([Validators.required, Validators.email])],
  //     userTypeId: [1],
  //     password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])],
  //     confirmPassword: ['', Validators.required],
  //   }, MustMatchValidator('password', 'confirmPassword')
  //   )
  // }

  setRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      userTypeId: new FormControl(1),
      password: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])),
      confirmPassword: new FormControl('', Validators.required),
    }, MustMatchValidator('password', 'confirmPassword')
    )
  }

  get ctrl() {
    return this.registerForm.controls;
  }

  login() {
    if (this.loginForm.get('username')?.value === "") {
      this._toaster.error("UserName is required..", "Login");
    } else if (this.loginForm.get('password')?.value === "") {
      this._toaster.error("Password is required..", "Password");
    } else {
      if (this.loginForm.valid) {
        this._http.post(Global.BASE_API_PATH + 'UserMaster/Login', this.loginForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._toaster.success("Login Succesfully", "Login");
            this._auth.authLogin(res.data);
            this.loginForm.reset();
          } else {
            this._toaster.error(res.errors[0], "Login");
          }
        })
      }
    }
  }

  register(formData: FormGroup) {
    this.submitted = true;
    if (this.registerForm.valid) {
      this._http.post(this.apiUrl + 'UserMaster/Save', this.registerForm.value).subscribe((res) => {
        if (res.isSuccess) {
          this._toaster.success("Registration successful", "Registration");
          this.registerForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            userTypeId: 1,
            password: '',
            confirmPassword: '',
          })
          this.submitted = false;
          this.activeTab = 'logintab';
        } else {
          this._toaster.error(res.errors[0], "Registration");
        }
      })
    }
  }

}
