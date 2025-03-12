import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Subject, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private idle$: Observable<any> = new Observable();
  private timerSubscription: Subscription = new Subscription();
  private idleSubscription: Subscription = new Subscription();
  private timeoutMilliseconds: number = 1000;
  public expired: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  public startWatching(timeoutSeconds: number): Observable<boolean> {
    const events = [
      'mousemove',
      'click',
      'mousedown',
      'keypress',
      'DOMMouseScroll',
      'mousewheel',
      'touchmove',
      'MSPointerMove',
      'resize',
    ];

    this.idle$ = merge(...events.map((event) => fromEvent(document, event)));
    this.timeoutMilliseconds = timeoutSeconds * 1000;

    this.idleSubscription = this.idle$.subscribe({
      next: () => this.resetTimer(),
      error: (err) => console.error('Error in idle subscription:', err),
    });

    this.startTimer();
    return this.expired;
  }

  private startTimer(): void {
    this.timerSubscription = timer(this.timeoutMilliseconds).subscribe({
      next: () => this.expired.next(true),
      error: (err) => console.error('Error in timer subscription:', err),
    });
  }

  public resetTimer(): void {
    this.timerSubscription.unsubscribe();
    this.startTimer();
  }

  public stopTimer(): void {
    this.timerSubscription.unsubscribe();
    this.idleSubscription.unsubscribe();
  }
}
