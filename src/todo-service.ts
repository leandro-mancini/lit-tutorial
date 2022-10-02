import { BehaviorSubject, map, Observable, publishReplay, refCount, scan, Subject } from "rxjs";
import { Todo } from "./todo.model";

const initialTodos: Todo[] = JSON.parse(localStorage.getItem('angular-rxjs-todos')) || [];
type TodosOperation = (todos: Todo[]) => Todo[];

export class TodoService {
    todos$: Observable<Todo[]>;
    createTodo$: Subject<Todo> = new Subject<Todo>();
    create$: Subject<Todo> = new Subject<Todo>();
    update$: BehaviorSubject<TodosOperation> = new BehaviorSubject<TodosOperation>((todos: Todo[]) => todos);

    value: Todo[];

    constructor() {
        this.todos$ = this.update$.pipe(
            scan((todos: Todo[], operation: TodosOperation) => operation(todos), initialTodos),
            publishReplay(1),
            refCount()
        );

        this.todos$.forEach(todos => localStorage.setItem('angular-rxjs-todos', JSON.stringify(todos)));

        this.create$.pipe(
            map((todo: Todo): TodosOperation => {
                return (todos: Todo[]) => todos.concat(todo);
            })
        ).subscribe(this.update$);

        this.createTodo$.subscribe(this.create$);
    }

    addTodo(title: string) {
        this.createTodo$.next(new Todo(title));
    }
}