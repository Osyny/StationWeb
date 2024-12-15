import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStatusOnChangesService {
  private isUserLoginChangedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isUserLoginChanged$: Observable<boolean> =
    this.isUserLoginChangedSubject.asObservable();

  updateIsUserLoginChanged(isUserLoginChanged: boolean): void {
    this.isUserLoginChangedSubject.next(isUserLoginChanged);
  }
}
