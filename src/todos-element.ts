import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import './todo-header.js';
import './todo-list.js';
import './todo-footer.js';
import { AsyncController } from "./async-controller.js";
import { repeat } from "lit/directives/repeat.js";
import { classMap } from "lit/directives/class-map.js";
import { BehaviorSubject } from "rxjs";
import { Todo } from "./todo.model.js";

const todos = new BehaviorSubject<Todo[]>([]);

@customElement('todos-element')
export class TodosElement extends LitElement {
    datasource = new AsyncController(this, todos.asObservable());

    handleAdd(event: CustomEvent<{ value: string }>) {
        this.datasource.addTodo(event.detail.value);
    }

    handleToggle(id: string): void {
        this.datasource.toggle(id);
    }

    handleRemove(id: string): void {
        this.datasource.remove(id);
    }

    render() {
        const hasCount = !!this.datasource.value?.length;
        const hasCompleted = !!this.datasource.value?.filter(todo => todo.completed).length;
        const remainintCount = this.datasource.value?.filter(todo => !todo.completed).length;

        return html`
            <section class="todoapp">
                <todo-header @add="${this.handleAdd.bind(this)}"></todo-header>
                <section class="main">
                    <input type="checkbox" class="toggle-all"/>
                    <ul class="todo-list">
                    ${repeat(this.datasource.value!, 
                        todo => todo.id, 
                        todo => {
                            const classes = { completed: todo.completed };

                            return html`<li class=${classMap(classes)}>
                                <div class="view">
                                    <input type="checkbox" class="toggle" value=${todo.completed} @change=${() => this.handleToggle(todo.id)} />
                                    <label>${todo.title}</label>
                                    <button class="button destroy" @click=${() => this.handleRemove(todo.id)}></button>
                                </div>
                                <input type="text" class="edit" />
                            </li>`
                        })
                    }
                    </ul>
                </section>
                <todo-footer
                    .hasCount=${hasCount}
                    .hasCompleted=${hasCompleted}
                    .remainintCount=${remainintCount}
                </todo-footer>
            </section>
        `;

    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }
}