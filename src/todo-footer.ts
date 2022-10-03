import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('todo-footer')
export class TodoFooter extends LitElement {
    @property()
    hasCount!: boolean;

    @property()
    hasCompleted!: boolean;

    @property()
    remainintCount!: number;

    removeCompleted(): void {
        const event = new CustomEvent('removeCompleted');

        this.dispatchEvent(event);
    }

    renderButtonClear(): TemplateResult {
        if (!this.hasCompleted) return html``;

        return html`<button class="clear-completed" @click=${this.removeCompleted}>Limpar</button>`
    }

    renderFilters(): TemplateResult {
        const currentStatus = location.pathname.replace('/', '');

        return html`
        <ul class="filters">
            <li>
                <a href="/" class=${currentStatus === '' ? 'selected' : ''}>Todos</a>
            </li>
            <li>
                <a href="active" class=${currentStatus === 'active' ? 'selected' : ''}>Ativo</a>
            </li>
            <li>
                <a href="completed" class=${currentStatus === 'completed' ? 'selected' : ''}>Concluído</a>
            </li>
        </ul>
        `;
    }

    render(): TemplateResult {
        if (this.hasCount) {
            return html`
            <footer class="footer" *ngIf="hasCount">
                <span class="todo-count">
                    <strong>${this.remainintCount}</strong> ${this.remainintCount === 1 ? 'item' : 'items'}
                </span>
                ${this.renderFilters()}
                ${this.renderButtonClear()}
            </footer>
            `
        }

        return html``;
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}