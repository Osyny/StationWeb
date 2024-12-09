import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SignalrService } from './services/signalr.service';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './layout/header/header.component';
import { HeaderUserComponent } from './layout/header-user/header-user.component';
import { UserAvatarComponent } from './layout/user-avatar/user-avatar.component';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AnimateModule } from 'primeng/animate';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

import { TokenInterceptor } from './interseptors/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';

import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarMenuComponent } from './layout/sidebar/sidebar-menu.component';
import { LayoutStoreService } from './shared/layout/layout-store.service';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HeaderBrandComponent } from './layout/header-brand/header-brand.component';
//import { TokenInterceptor } from './interseptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderUserComponent,
    UserAvatarComponent,

    SidebarComponent,

    SidebarMenuComponent,
    HeaderBrandComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PanelMenuModule,
    AnimateModule,

    BrowserAnimationsModule,
    // NgToastModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),

    RouterModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    provideClientHydration(),
    CookieService,
    SignalrService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (signalrService: SignalrService) => () =>
    //     signalrService.startConnection(),
    //   deps: [SignalrService],
    //   multi: true,
    // },
    LayoutStoreService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
