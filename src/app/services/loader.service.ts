import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading: BehaviorSubject<boolean> = new  BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable()
  constructor() { }

  showLoader(){
    this.isLoading.next(true);
  }

  hideLoader(){
    this.isLoading.next(false);
  }
}
