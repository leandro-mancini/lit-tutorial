import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription } from 'rxjs';

export class AsyncController<T> implements ReactiveController {
    sub: Subscription | null = null;

    constructor(
        private host: ReactiveControllerHost, 
        private source: Observable<T>, 
        public value?: T
    ) {
        this.host.addController(this);
    }

    hostConnected() {
        console.log('hostConnected', this.host)

        this.sub = this.source.subscribe(value => {
            console.log('value', value)
            this.value = value;

            this.host.requestUpdate()
        });
    }

    hostDisconnected() {
        this.sub?.unsubscribe();
    }
}