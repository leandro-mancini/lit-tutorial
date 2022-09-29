import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { interval } from "rxjs";
import { subscribe } from './subscribe-lit.directive';

@customElement('counter-element')
export class CounterElement extends LitElement {
    num = interval(1000);

    render() {
        return html`
            Counter: ${subscribe(this.num)}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'counter-element': CounterElement
    }
}