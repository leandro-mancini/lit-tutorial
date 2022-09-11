import { CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from 'lit/decorators.js'
import styles from './card.styles';

@customElement('card-element')
export class CardElement extends LitElement {
    static styles: CSSResultGroup = styles;

    @property({ type: String }) title: string = '';
    @property({ type: String }) icon: string = '';

    render(): TemplateResult {
        return html`
            <div class="c-card">
                <h3 class="c-card__title">
                    ${this.title}
                    <span class="c-card__icon">${this.icon}</span>
                </h3>
                <div class="c-card__content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'card-element': CardElement
    }
}