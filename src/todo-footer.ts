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

    renderButtonClear(): TemplateResult {
        if (!this.hasCompleted) return html``;

        return html`<button class="clear-completed">Limpar</button>`
    }

    renderFilters(): TemplateResult {
        return html`
        <ul class="filters">
            <li>
                <a href="javascript:;" class="currentStatus">Todos</a>
            </li>
            <li>
                <a href="javascript:;">Ativo</a>
            </li>
            <li>
                <a href="javascript:;">Concluído</a>
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