# useValueObservable

```js
const count$ = new BehaviorSubject(42)

function Counter() {
    const count = useValueObservable(count$)
    return <div>{count}</div>
}
```
