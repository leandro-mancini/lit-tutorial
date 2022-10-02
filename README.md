# Lit & RxJS

Com base nos padrões de Web Components, o [Lit](https://lit.dev/) adiciona exatamente o que você precisa para ser feliz e produtivo.

Neste tutorial, aprenderemos como usar [RxJS](https://rxjs.dev/) com [Lit](https://lit.dev/) e como eles funcionam bem juntos. 

Vamos primeiro criar um componente para que tenhamos algo para trabalhar:

```typescript
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { interval } from "rxjs";

@customElement('counter-element')
export class CounterElement extends LitElement {
    num = interval(1000);

    render() {
        return html`
            Counter: ??
        `
    }
}
```

Vamos explorar duas maneiras de usar ___observables___ ​​em Lit:

## Diretiva assíncrona personalizada

A primeira maneira é usar uma diretiva assíncrona personalizada:

```typescript
import { noChange } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { Observable, Subscription } from 'rxjs';

class SubscribeDirective extends AsyncDirective {
    observable: Observable<unknown> | undefined;
    sub: Subscription | null = null;

    render(observable: Observable<unknown>) {
        if (this.observable !== observable) {
            this.sub?.unsubscribe();
            this.observable = observable;

            if (this.isConnected) {
                this.subscribe(observable);
            }
        }

        return noChange;
    }

    subscribe(observable: Observable<unknown>) {
        this.sub = observable.subscribe((v: unknown) => {
            this.setValue(v);
        });
    }

    disconnected() {
        this.sub?.unsubscribe();
    }

    reconnected() {
        this.subscribe(this.observable!);
    }
}

export const subscribe = directive(SubscribeDirective);
```

O código é direto no método `render()`, cancelamos a assinatura do antigo se o ___observable___ mudar e assinamos o novo. Atualizamos o valor do modelo usando a API `setValue()` assíncrona da diretiva quando o ___observable___ é emitido.

Por fim, cancelamos a assinatura quando a diretiva é desconectada do DOM. Vamos usá-lo em nosso modelo:

```typescript
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { interval } from "rxjs";
import { subscribe } from './subscribe-lit.directive';

@customElement('counter-element')
export class CounterElement extends LitElement {
    num = interval(1000);

    render() {
        return html`
            Counter: ${subscribe(this.num)}
        `
    }
}
```

Quando precisamos usar o valor no modelo diretamente, é conveniente usar uma diretiva. No entanto, precisaremos adotar uma abordagem diferente quando precisarmos passar o valor para outras diretivas, como [`repeat`](https://lit.dev/docs/api/directives/#repeat) ou usá-lo na instância do componente.

Passando para a segunda maneira, vamos criar um controlador reativo:

## Controlador reativo

Os controladores reativos podem se conectar ao [ciclo de atualização reativa](https://lit.dev/docs/components/lifecycle/#reactive-update-cycle) de um componente. Um controlador pode agrupar o estado e o comportamento relacionados a um recurso, tornando-o reutilizável em várias definições de componentes.

Vamos criar um `AsyncController` que recebe um `observable`, se inscreve nele e expõe o valor:

```typescript
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription } from 'rxjs';

export class AsyncController<T> implements ReactiveController {
    sub: Subscription | null = null;

    constructor(
        private host: ReactiveControllerHost, 
        private source: Observable<T>, 
        public value?: T
    ) {
        this.host.addController(this);
    }

    hostConnected() {
        this.sub = this.source.subscribe(value => {
            this.value = value;
            this.host.requestUpdate()
        });
    }

    hostDisconnected() {
        this.sub?.unsubscribe();
    }
}
```

O controlador recebe uma fonte `observable` e um valor inicial opcional. Em uma nova emissão, ele atualiza a propriedade `value` e solicita uma atualização do template host.

O legal do Lit é que ele atualiza em lote para maximizar o desempenho e a eficiência. Definir várias propriedades de uma só vez aciona apenas uma atualização agendada de forma assíncrona no momento `microtask`.

Vamos usar nosso controlador:

```typescript
import { randTodo, Todo } from "@ngneat/falso";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from 'lit/directives/repeat.js';
import { BehaviorSubject } from "rxjs";
import { AsyncController } from "./async-controller-lit";

const todos = new BehaviorSubject<Todo[]>([]);

@customElement('todos-element')
export class TodosElement extends LitElement {
    dataSource = new AsyncController(this, todos.asObservable());

    async fetchTodos() {
        todos.next(randTodo())
    }

    render() {
        return html`
            <button @click=${this.fetchTodos}>Fetch todos</button>
            
            <ul>
                ${repeat(this.dataSource.value!, 
                    todo => todo.id, 
                    todo => html`<li>${todo.title}</li>`)
                }
            </ul>
        `
    }
}
```
