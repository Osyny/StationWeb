import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserDto } from '../../models/user-model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { UserStoreService } from '../../services/user/user-store.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  modalRef!: BsModalRef;

  $unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,

    private toastr: ToastrService,
    private userStore: UserStoreService,
    private auth: AuthService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    let user: UserDto | undefined;
    this.authService
      .login(this.form.value.email, this.form.value.password)
      .pipe(
        takeUntil(this.$unsubscribe),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.loading = true;

        user = res?.user;
        if (!user) {
          this.toastr.error('Gmail or password is wrong!', 'Error');
        } else {
          this.auth.storeToken(res.token);
          //  this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();

          this.userStore.setFullNameForStore(tokenPayload.userName);
          this.userStore.setRoleForStore(tokenPayload.role);

          this.toastr.success('Login is success!', 'Success');
          this.router.navigateByUrl('/admin');
        }
      });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  openModal() {
    const createOrEditModal = this.modalService.show(
      ForgotPasswordModalComponent,
      {
        class: 'modal-lg',
        initialState: {
          title: 'Forgot you password?',
        },
      }
    );
  }
}
