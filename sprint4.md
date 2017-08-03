## Sprint 4: Creating Todos


Creating todos will require a form on the client side.  In this sprint, you'll create a `CreateTodoForm` component to handle that form. The new component will join `TodoList` as one of the children of the `TodosContainer` component.


<!-- The state of the `CreateTodoForm` will have an effect on the state of the todos overall Before we build this feature out, there How can we pass state from a child component to a parent? The opposite is easy, because we're able to just pass properties to our child components. Child state to parent state is much more difficult because we can't pass properties like that. Its unidirectional. The answer? Callbacks.
 -->


### Create Todo Form and Events

1. Create a file called `src/components/CreateTodoForm.js`, and add the following code:

```js
// src/components/CreateTodoForm.js
import React, {Component} from 'react'

class CreateTodoForm extends Component {
  render(){
    return (
      <div className='createForm todoForm'>
        <h2>Create Todo Here!</h2>
        <form>
          <input
            placeholder='Write a todo here ...'
            type='text'
            value='write a new todo' />
          <button type='submit'>Create Todo!</button>
        </form>
      </div>
    )
  }
}

export default CreateTodoForm
```

2. Add a `CreateTodoForm` component to the `TodosContainer` component's `render` method. (Don't forget to import the `CreateTodoForm` as well!)

```js
render(){
    return (
      <div className='todosContainer'>
        <CreateTodoForm />
        <TodoList
          todos={this.state.todos} />
      </div>
    )
  }
```

3. Briefly try out the form on the `/todos` page.  Identify which part of your code set up the text inside the input box.  What happens if you submit the form?  What happens if you try to change the input?

4. Instead of the `value` of the input box staying the same, it will be tied into the component's state, and it will change when users type in the input box.  To get started, set up `state` in the `CreateTodoForm` component.

```js
// inside src/components/CreateTodoForm.js
class CreateTodoForm extends Component {
  constructor(props){
    // use Component's constructor
    super(props)
    // set initial state
    this.state = {
      todo: ''
    }
  }
  render(){
    return (
      <div className='createForm todoForm'>
        <h2>Create Todo Here!</h2>
        <form>
          <input
            placeholder='Write a todo here ...'
            type='text'
            value={this.state.todo} />
          <button type='submit'>Create Todo!</button>
        </form>
      </div>
    )
  }
}
```

5. Use the code below to add an `onChange` event handler to the `input` text box that will call the yet-to-be-written `onInputChange` method:

```jsx
<input
  onChange={event => this.onInputChange(event)}
  placeholder='Write a todo here ...'
  type='text'
  value={this.state.todo} />
```


6. Think critically about the code above. What kind of value is the JSX going to add in for the `onChange` attribute?

<details><summary>click for answer</summary>The value inside <code>{}</code> is an anonymous function that takes in an event and calls another function with that event as the argument.</details>

<br>

7. For the event handler to keep `state` updated, there must be a `this.onInputChange` function.  Add the `onInputChange` function to the `CreateTodoForm` class.

```jsx
class CreateTodoForm extends Component {
  constructor(){
    super()

    this.state = {
      todo: ''
    }
  }

  onInputChange(event){
    console.log('create todo input changed')
  }

  // ...

```

8. Modify the `onInputChange` function so that instead of logging a message to the console, it changes the state.  The `todo` in the state should have value `event.target.value`.

Hint: for an example of setting state, you can reference the `TodosContainer` class's `fetchData` method.

9. When the form is submitted, the page currently refreshes. Instead, it should make an AJAX request to the super-crud API to add the new todo.  In the JSX code for the component, add an `onSubmit` attribute to the `form` element:

```js
<form onSubmit={event => this.onFormSubmit(event)}>
```

10. Create an `onFormSubmit` method inside the `CreateTodoForm` component class.

```js
onFormSubmit(event){
  console.log('form submitted')
  // this line keeps the page from refreshing!
  event.preventDefault()
  let newTodo = this.state.todo
  this.props.createTodo(newTodo)
  this.setState({
    todo: ''
  })
}
```


> You **should** see an error in your browser console.

11. Think critically about the code snippet above.

* What does `event.PreventDefault()` do?

* What will the value of `this.state.todo` be when the form is submitted?

* Is `this.props.createTodo` already a function? (Check where the `CreateTodoForm` is `render`ed in the `TodosContainer` class.)

### Todo Creation & AJAX

> In order to pass data from the `CreateTodoForm` up to the `TodosContainer`, it needs some way of communicating with the `TodosContainer`. We will make that happen by providing the `CreateTodoForm` with a function to call with that updated data; that function will come from `TodosContainer` so that we can set it up to update that container correctly.

1. Since `createTodo` is an attribute of a `CreateTodoForm` component's `prop`, it needs to be supplied by the parent component. Update the `src/containers/TodosContainer.js` to pass a `createTodo` function into the form component:

```js
// src/containers/TodosContainer.js
// ...
createTodo(newBody) {
  console.log('creating todo', newBody)
}
render(){
  return (
    <div className="todosComponent">
      <CreateTodoForm
        createTodo={this.createTodo.bind(this)} />
      <TodoList
        todos={this.state.todos} />
    </div>
  )
}
```

2. Think critically about the code above.

> The `render` method for `TodosContainer` passes the `createTodo` function of the container component TO the `CreateTodoForm` component.

> The `bind(this)` portion of the code means the `createTodo` function will use THIS `TodosContainer` component as `this`, even though it's called from a different part of the code (inside `CreateTodoForm`'s `onFormSubmit` method).


3. The `createTodo` method should use the todo body passed in to make an AJAX request to the server.  AJAX is the role of the `TodoModel` class, though, so add a static `create` method to that model class.


```js
static create(todo) {
  let request = $.ajax({
    url: "https://super-crud.herokuapp.com/todos",
    method: 'POST',
    data: todo
  })
  return request
}
```

4. Back in the `TodoContainer` class's `createTodo` method, group the form data about a todo in an object and store it in a variable. Then, pass that object into the `TodoModel.create` method.

```js
createTodo(newBody) {
  let newTodo = {
    body: newBody,
    completed: false
  }
  TodoModel.create(newTodo).then((res) => {
    console.log('created todo', res)
    let todos = this.state.todos
    let newTodos = todos.push(res)
    this.setState({newTodos})
  })
}
```

5. Think critically about the code above. What happens after the todo is successfully created?

<details><summary>click for an answer</summary>A new <code>todos</code> variable contains all the current todos from the <code>TodosContainer</code> state. It adds the new todo from the response into a <code>newTodos</code> array, after all of the original todos. Then, it sets the component's state to the new array.</details>

### Backtrack - How did we pass state from child to parent?

Remember that in the submit event of the form, we used a function `this.props.createTodo()`:

In `src/components/CreateTodoForm`:

```js
onFormSubmit(event){
  event.preventDefault()
  let newTodo = this.state.todo
  this.props.createTodo(newTodo)
  this.setState({
    todo: ""
  })
}
```

We pass `createTodo` from the container as `props`. In `src/containers/TodosContainer.js`:

```js
render(){
  return (
    <div className='todosContainer'>
      <CreateTodoForm
      createTodo={this.createTodo.bind(this)} />
      <TodoList
        todos={this.state.todos} />
    </div>
  )
}
```

The argument passed in at the `CreateTodoForm` level(child) was state from that component. And now it updates state at the `TodosContainer` level(parent).
