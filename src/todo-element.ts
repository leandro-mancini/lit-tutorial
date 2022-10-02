import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement('todo-element')
export class TodoElement extends LitElement {
    @property()
    label!: string;

    render() {
        return html`
        <div class="flex align-center sb">
            <div class="flex">
                <label>
                    <input type="checkbox" [formControl]="control"/>
                    <span></span>
                </label>
                ${this.label}
            </div>
            <a class="btn waves-effect waves-light red btn-small btn-floating">
                <i class="material-icons" (click)="delete.emit(todo.id)">delete_forever</i>
            </a>
        </div>
        `
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}