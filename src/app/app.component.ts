import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Event as NavigationEvent,
  NavigationStart,
  Router,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  event$!: Subscription;
  title = 'web-app';
  protected router = inject(Router);
  protected currentURL = '';

  ngOnInit(): void {
    this.getCurrentURL();
  }

  private getCurrentURL() {
    this.event$ = this.router.events.subscribe({
      next: (event: NavigationEvent) => {
        if (event instanceof NavigationStart) {
          console.log(event.url);
          this.currentURL = event.url;
        }
      },
    });
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }
}
