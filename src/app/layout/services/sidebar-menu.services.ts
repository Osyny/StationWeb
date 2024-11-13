import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarMenuOnChangesService {
  private pageChangedSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  pageChanged$: Observable<number> = this.pageChangedSubject.asObservable();

  updatePageChanged(pageChanged: number): void {
    this.pageChangedSubject.next(pageChanged);
  }
}
