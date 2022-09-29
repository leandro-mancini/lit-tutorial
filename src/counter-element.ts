import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { interval } from "rxjs";

@customElement('counter-element')
export class CounterElement extends LitElement {
    num = interval(1000);

    render() {
        return html`
            Counter: ??
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'counter-element': CounterElement
    }
}