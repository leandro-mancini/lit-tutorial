import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('todo-header')
export class TodoHeader extends LitElement {
    addTodo(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement;
            const event = new CustomEvent<{ value: string }>('add', { detail: { value: input.value }});

            this.dispatchEvent(event);

            input.value = '';
        }
    }

    render() {
        return html`
        <header class="header">
            <h1>todos</h1>
            <input @keydown=${this.addTodo} type="text" class="new-todo" placeholder="O que precisa ser feito?" #toggleall />
        </header>
        `
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}