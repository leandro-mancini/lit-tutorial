import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('todo-item')
export class TodoItem extends LitElement {
    @property()
    id!: string;

    @property()
    title!: string;

    render() {
        return html`
        <li>
            <div class="view">
                <input type="checkbox" class="toggle" />
                <label>${this.title}</label>
                <button class="button" class="destroy"></button>
            </div>
            <input 
                type="text"
                class="edit"
                #edittodo
                *ngIf="editing"
                [value]="todo.title"
                (blur)="stopEditing(edittodo.value)"
                (keyup.enter)="stopEditing(edittodo.value)"
                (keyup.escape)="cancelEditing()"
            />
        </li>
        `
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}