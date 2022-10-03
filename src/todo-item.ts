import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('todo-item')
export class TodoItem extends LitElement {
    @property()
    id!: string;

    @property()
    title!: string;

    @property()
    completed!: boolean;

    onToggle(id: string): void {
        const event = new CustomEvent<{ id: string }>('toggle', { detail: { id }});

        this.dispatchEvent(event);
    }

    onRemove(id: string): void {
        const event = new CustomEvent<{ id: string }>('remove', { detail: { id }});

        this.dispatchEvent(event);
    }

    render() {
        return html`
        <div class="view">
            <input type="checkbox" class="toggle" value=${this.completed} @change=${() => this.onToggle(this.id)} />
            <label>${this.title}</label>
            <button class="button destroy" @click=${() => this.onRemove(this.id)}></button>
        </div>
        `
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}