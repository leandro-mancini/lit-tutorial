import { html, LitElement, PropertyDeclaration, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import './todo-item.js';
import { Todo } from "./todo.model.js";

@customElement('todo-list')
export class TodoList extends LitElement {
    @property({ type: Array })
    todoList!: Todo[];

    private _todos: Todo[];

    _toggle(id: string) {
        const event = new CustomEvent<{ value: string }>('toggle', { detail: { value: id }});
        this.dispatchEvent(event);
    }

    editing = false;

    requestUpdate(name?: PropertyKey | undefined, oldValue?: unknown, options?: PropertyDeclaration<unknown, unknown> | undefined): void {
        super.requestUpdate(name, oldValue, options);

        console.log('requestUpdate', this.todoList)

        this._todos = this.todoList;
    }

    render() {
        console.log('render', this.todoList)

        return html`
        <section class="main">
            <input type="checkbox" class="toggle-all"/>
            <ul class="todo-list">
            ${repeat(this._todos!, 
                todo => todo.id, 
                todo => {
                    const classes = { completed: todo.completed, editing: this.editing };

                    return html`<li class=${classMap(classes)}>
                        <div class="view">
                            <input type="checkbox" class="toggle" value=${todo.completed} @change=${() => this._toggle(todo.id)} />
                            <label>${todo.title}</label>
                            <button class="button" class="destroy"></button>
                        </div>
                        <input type="text" class="edit" />
                    </li>`
                })
            }
            </ul>
        </section>
        `
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}
