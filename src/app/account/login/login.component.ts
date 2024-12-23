import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserDto } from '../../models/user-model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { UserStoreService } from '../../services/user/user-store.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { UserStatusOnChangesService } from '../services/user-status-changed.service';
import { ValidationError } from '../../shared/validation/validation.api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email?: string;
  password?: string;
  form!: FormGroup;
  loading = false;

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  modalRef!: BsModalRef;
  user?: UserDto | null;
  isAuthorized: boolean = true;

  $unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,

    private toastr: ToastrService,
    private userStore: UserStoreService,
    private auth: AuthService,
    private modalService: BsModalService,
    private _userStatusOnChangesService: UserStatusOnChangesService
  ) {
    this.authService.user?.subscribe((x) => {
      this.user = x;
    });
  }

  ngOnInit() {
    this._userStatusOnChangesService.isUserLoginChanged$.subscribe((res) => {
      this.isAuthorized = res;
    });
  }

  onSubmit(ngForm: NgForm) {
    this.loading = true;
    if (ngForm.invalid) {
      ngForm.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    let user: UserDto | undefined;
    if (this.email && this.password) {
      this.authService
        .login(this.email, this.password)
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
            this._userStatusOnChangesService.updateIsUserLoginChanged(true);
            this.auth.storeToken(res.token);
            this.auth.setLocalData(res);
            //  this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();

            this.userStore.setFullNameForStore(tokenPayload.userName);
            this.userStore.setRoleForStore(tokenPayload.role);

            this.toastr.success('Login is success!', 'Success');
            this.router.navigateByUrl('/admin');
          }
        });
    }
  }

  hideShowPass() {
    this.isText = !this.isText;
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
