import {Component, effect, Input, OnDestroy, OnInit, WritableSignal} from '@angular/core';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  templateUrl: './timer.component.html',
  imports: [],
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  @Input() loading!: WritableSignal<boolean>;

  protected seconds: number = 0;

  private intervalSubscription: Subscription | null = null;

  constructor() {
    effect(() => {
      console.log('this.loading:::: ', this.loading());
      if (this.loading()) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    console.log('ngOnInit:::: ', this.loading());
  }

  startTimer(): void {
    console.log('startTimer:::: ', this.loading());
    this.stopTimer();
    this.seconds = 0;
    this.intervalSubscription = interval(100).subscribe(() => {
      this.seconds += 0.1;
    });
  }

  stopTimer(): void {
    console.log('stopTimer:::: ', this.loading());
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
