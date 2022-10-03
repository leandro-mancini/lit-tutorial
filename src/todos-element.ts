import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { classMap } from "lit/directives/class-map.js";
import { BehaviorSubject } from "rxjs";

import { AsyncController } from "./async-controller.js";
import { Todo } from "./todo.model.js";

import './todo-header.js';
import './todo-item.js';
import './todo-footer.js';

const todos = new BehaviorSubject<Todo[]>([]);

@customElement('todos-element')
export class TodosElement extends LitElement {
    datasource = new AsyncController(this, todos.asObservable());
    visibleTodos: Todo[] | undefined = [];

    handleAdd(event: CustomEvent<{ value: string }>) {
        this.datasource.addTodo(event.detail.value);
    }

    handleToggle(id: string): void {
        this.datasource.toggle(id);
    }

    handleRemove(id: string): void {
        this.datasource.remove(id);
    }

    handleRemoveCompleted() {
        this.datasource.removeCompleted();
    }

    checkTodosVisible(): Todo[] | undefined {
        const currentStatus = location.pathname.replace('/', '');
        let currentTodos: Todo[] | undefined;

        switch (currentStatus) {
            case 'active':
                currentTodos = this.datasource.value?.filter(todo => !todo.completed);
                break;
            case 'completed':
                currentTodos = this.datasource.value?.filter(todo => todo.completed);
                break;
            default:
                currentTodos = this.datasource.value;
                break;
        }

        return currentTodos;
    }

    render(): TemplateResult {
        const hasCount = !!this.datasource.value?.length;
        const hasCompleted = !!this.datasource.value?.filter(todo => todo.completed).length;
        const remainintCount = this.datasource.value?.filter(todo => !todo.completed).length;

        this.visibleTodos = this.checkTodosVisible();

        return html`
            <section class="todoapp">
                <todo-header @add="${this.handleAdd.bind(this)}"></todo-header>
                <section class="main">
                    <input type="checkbox" class="toggle-all"/>
                    <ul class="todo-list">
                    ${repeat(this.visibleTodos!, 
                        todo => todo.id, 
                        todo => {
                            const classes = { completed: todo.completed };

                            return html`<li class=${classMap(classes)}>
                                <todo-item
                                    .id=${todo.id}
                                    .title=${todo.title}
                                    .completed=${todo.completed}
                                    @toggle=${() => this.handleToggle(todo.id)}
                                    @remove=${() => this.handleRemove(todo.id)}
                                ></todo-item>
                            </li>`
                        })
                    }
                    </ul>
                </section>
                <todo-footer
                    @removeCompleted=${this.handleRemoveCompleted.bind(this)}
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