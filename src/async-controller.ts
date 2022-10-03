import { ReactiveController, ReactiveControllerHost } from 'lit';
import { BehaviorSubject, map, Observable, publishReplay, refCount, scan, Subject, Subscription } from 'rxjs';
import { Todo } from './todo.model';

const TODOS = 'lit-rxjs-todos';
const initialTodos: Todo[] = JSON.parse(localStorage.getItem(TODOS)) || [];
type TodosOperation = (todos: Todo[]) => Todo[];

export class AsyncController implements ReactiveController {
    sub: Subscription | null = null;
    todos$!: Observable<Todo[]>;
    update$: BehaviorSubject<TodosOperation> = new BehaviorSubject<TodosOperation>((todos: Todo[]) => todos);
    createTodo$: Subject<Todo> = new Subject<Todo>();
    create$: Subject<Todo> = new Subject<Todo>();
    toggleTodo$: Subject<string> = new Subject<string>();
    toggle$: Subject<string> = new Subject<string>();
    removeTodo$: Subject<string> = new Subject<string>();
    remove$: Subject<string> = new Subject<string>();
    removeCompletedTodo$: Subject<null> = new Subject<null>();
    removeCompleted$: Subject<null> = new Subject<null>();

    constructor(
        private host: ReactiveControllerHost,
        private source: Observable<Todo[]>,
        public value?: Todo[]
    ) {
        this.host.addController(this);

        this.source = this.todos$ = this.update$.pipe(
            scan((todos: Todo[], operation: TodosOperation) => operation(todos), initialTodos),
            publishReplay(1),
            refCount()
        );

        this.todos$.forEach(todos => localStorage.setItem(TODOS, JSON.stringify(todos)));

        this.create$.pipe(
            map((todo: Todo): TodosOperation => {
                return (todos: Todo[]) => todos.concat(todo);
            })
        ).subscribe(this.update$);

        this.toggle$.pipe(
            map((uuid: string): TodosOperation => {
                return (todos: Todo[]) => {
                    const todo = todos.find(t => t.id === uuid) as Todo;

                    todo.completed = !todo.completed;

                    return todos;
                }
            })
        ).subscribe(this.update$);

        this.remove$.pipe(
            map((uuid: string): TodosOperation => (todos: Todo[]) => todos.filter(todo => todo.id !== uuid))
        ).subscribe(this.update$);

        this.removeCompleted$.pipe(
            map((): TodosOperation => (todos: Todo[]) => todos.filter(todo => !todo.completed))
        ).subscribe(this.update$);

        this.createTodo$.subscribe(this.create$);
        this.toggleTodo$.subscribe(this.toggle$);
        this.removeTodo$.subscribe(this.remove$);
        this.removeCompletedTodo$.subscribe(this.removeCompleted$);
    }

    addTodo(title: string): void {
        this.createTodo$.next(new Todo(title));
    }

    toggle(uuid: string): void {
        this.toggleTodo$.next(uuid);
    }

    remove(uuid: string): void {
        this.removeTodo$.next(uuid);
    }

    removeCompleted(): void {
        this.removeCompletedTodo$.next(null);
    }

    hostConnected(): void {
        this.sub = this.source.subscribe(value => {
            this.value = value;
            this.host.requestUpdate();
        })
    }

    hostDisconnected(): void {
        this.sub?.unsubscribe();
    }
}
