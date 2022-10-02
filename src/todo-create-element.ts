import { Todo } from "@ngneat/falso";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { BehaviorSubject } from "rxjs";
import { AsyncController } from "./async-controller-lit";

const todos = new BehaviorSubject<Todo>({});

@customElement('todo-create-element')
export class TodoCreateElement extends LitElement {
    _onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement;
            const value = input.value;

            const dataSource = new AsyncController(this, todos.asObservable(), { id: '4k3hj4h32jh4jk32', title: 'Testando', completed: false });
            todos.next({ id: '4k3hj4h32jh4jk32', title: 'Testando', completed: false })

            console.log(value)

            input.value = '';
        }
    }

    render() {
        return html`
            <div class="input-field">
                <i class="material-icons prefix">add</i>
                <input @keydown=${this._onKeyDown} type="text" class="form-control" placeholder="Add Todo...">
            </div>
        `
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}