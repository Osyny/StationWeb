import { ElementRef, Injector } from '@angular/core';
//import { NotifyService }  from 'abp-ng2-module';

export abstract class AppComponentBase {
  // notify: NotifyService;
  //  setting: SettingService;
  //message: MessageService;

  // appSession: AppSessionService;
  elementRef: ElementRef;

  constructor(injector: Injector) {
    // this.notify = injector.get(NotifyService);

    // this.message = injector.get(MessageService);

    // this.appSession = injector.get(AppSessionService);
    this.elementRef = injector.get(ElementRef);
  }
}
