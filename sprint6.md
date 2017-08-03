## Sprint 6: Editing and Updating Todos



### `EditTodoForm` Component

1. Create a new file for an `EditTodoForm` component. Add a simple form.

```js
// src/components/EditTodoForm.js
import React, {Component} from 'react'

class EditTodoForm extends Component {
  render(){
    return (
      <div className='editTodoForm'>
        <form>
          <input
            placeholder='Write updated todo here...'
            type='text'
            value='' />
          <button type='submit'>Update Todo!</button>
        </form>
      </div>
    )
  }
}

export default EditTodoForm
```

2. Import the `EditTodoForm` component into `src/components/Todo.js`, and add the `EditTodoForm` component into the `Todo` component's `render` method. Since only one JSX element can be returned, wrap the form and the existing paragraph in a `div`.

```js
class Todo extends Component {
  render(){
    return(
      <div>
        <p data-todos-index={this.props.todo._id}>
          <span>{this.props.todo.body}</span>
          <span
            className='deleteButton'
            onClick={() => this.props.onDeleteTodo(this.props.todo)}>
              (X)
          </span>
        </p>
        <EditTodoForm />
      </div>
    )
  }
}
```

3. Try interacting with the edit forms on the `/todos` route.  


> Just like the initial CreateTodoForm, these forms have some problems:

> * They don't allow the user to change the input field.

> * They use the default behavior for form submission (including reloading the page).

> * They aren't connecting the value of the text in the input to any part of the component's `props` or `state`.

4. Update the edit todo form JSX with an `onChange` attribute for the input element. The `onChange` should capture the change event and send it to another method of the class.  

Also write a simple version of the new method that `console.log`s a message.

> Consider calling the new method `onInputChange` to match the structure  used for `CreateTodoForm`.

```js
// src/components/EditTodoForm.js
// ...
  onInputChange(event) {
    console.log('changing a todo!')
  }
  render(){
    return (
      <div className='editTodoForm'>
        <form>
          <input
            onChange={event => this.onInputChange(event)}
            placeholder='Write updated todo here...'
            type='text'
            value='' />
// ...
```

5. Update the `onInputChange` event so that it sets a value within the state of the form component.  

```js
// src/components/EditTodoForm.js
// ...
  onInputChange(event){
    console.log('changing a todo!')
    this.setState({
      updatedTodoBody: event.target.value
    })
  }
```

6. Add a `constructor` method to initialize the state.

```js
// src/components/EditTodoForm.js
// ...
  constructor(){
    // use Component's constructor
    super()
    // set initial state
    this.state = {
      updatedTodoBody: ''
    }
  }
// ...
```

7. Set the `value` of the input in the edit todo form JSX to `this.state.updatedTodoBody`.

```js
<input
  onChange={event => this.onInputChange(event)}
  placeholder='Write updated todo here...'
  type='text'
  value={this.state.updatedTodoBody} />
```

8. Add an `onSubmit` attribute to the form element in the `EditTodoForm` JSX, and create an `onFormSubmit` method in the class that logs a message to the console instead of submitting the form with the default behavior.

```js
<form onSubmit={event => this.onFormSubmit(event)}>
```

```js
onFormSubmit(event){
  event.preventDefault()
  console.log('edit todo form submitted')
}
```

9. Think critically about the code you just wrote. What will the `onFormSubmit` function actually need to do? Write a few lines of pseudocode comments to plan what will happen.

<details><summary>click for ideas</summary>

* get the value from the form or from `state` (the new todo text)  
* send the value "up" to higher components by calling a method from `this.props`  
* empty out the form value again

</details>

<br>

10. Instead of just logging a message, update the `onFormSubmit` method. It should call a `this.props.onUpdateTodo` method using the `updatedTodoBody` from the component's state as an argument. Then, it should reset the `updatedTodoBody` to an empty string so the form value clears.

```js
onFormSubmit(event){
  event.preventDefault()
  console.log('edit todo form submitted')
  this.props.onUpdateTodo(this.state.updatedTodoBody)
  this.setState({
    updatedTodoBody: ''
  })
}
```


11. Check where the `TodoForm` is rendered in the `Todo` component.  Does the `Todo` component send through an `onUpdateTodo` method through props?


### Set Up `onUpdateTodo` Method

The `TodosContainer` controls the logic for todos, so the code for updating a todo will be added mostly in `TodosContainer` and then passed down to the `TodoForm` through props.

1. Create an `updateTodo` method in the `TodosContainer` component class. For now, have it `console.log` a message.  

2. Think critically about the code you'll write, and add a few lines of pseudocode in comments. What will the `updateTodo` method need to do?  

<details><summary>click for some ideas</summary>

* have access to the id of the todo that needs to be updated

* have access to the new information for the todo being updated

* call a method in the `TodoModel` class that sends the AJAX request for super-crud to modify the todo

* update `this.state.todos` based on the API response

</details>


3. When `TodosContainer` renders the `TodoList` component, pass through the `updateTodo` method as an `onUpdateTodo` prop.  Remember to `bind` the `this` from `TodosContainer`.

4. In `TodoList`, when rendering the `Todo` component, pass through the `this.props.onUpdateTodo` method as an `onUpdateTodo` prop.

5. In `Todo`, when rendering the `EditTodoForm` component, pass through the `this.props.onUpdateTodo` method as an `onUpdateTodo` prop.

6. Try submitting the form again. If all elements are connected correctly, the log message from `updateTodo` in `TodosContainer` will appear in the console.

### Fill in AJAX Call to Update Todo

1. Add a method to the `TodoModel` class that makes an AJAX call to update a todo through the super-crud API.

> Hint: reference jQuery `$.ajax` documentation, [super-crud documentation](https://github.com/SF-WDI-LABS/super-crud-api), and the other methods in the `TodoModel` class.  

> Hint: This method will need to take in the new `body` for the todo as well as the `id` of the todo you're updating.


2. Now that the `TodoModel` has an `update` method, fill in the `TodosContainer`'s `updateTodo` method.

> The `updateTodo` method will also need the updated `body` and the `id` for the todo, so you may need to modify the structure to have both of those parameters.

> Remember to modify the item(s) in `this.state.todos` to match the updated information once the API response comes back.

> You **should** see an error if you try to submit the form. It won't work until you're actually passing the `id` data through from the `EditTodoForm`.

3. In order for the `EditTodoForm` to call the new `updateTodo` method, it will need access to the `_id` of each todo.  First, add the `todo` as a prop for `EditTodoForm` when rendering the `EditTodoForm` from the `Todo` class.

4. In the `EditTodoForm` JSX, add `data-todo-id` to the `div`:

```js
<div className='editTodoForm' data-todos-index={this.props.todo._id}>
```

5. Modify the `EditTodoForm` class's `onFormSubmit` method to send the updated todo body *and* the todo id to `this.props.onUpdateTodo`.  

6. Check the behavior of the edit form now. It should work!

If you have problems, remember the solutions are available.

















<!--


In `containers/TodosContainer.js`:

```js
updateTodo(todoBody) {
    var todoId = this.state.editingTodoId
    function isUpdatedTodo(todo) {
        return todo._id === todoId;
    }
    TodoModel.update(todoId, todoBody).then((res) => {
        let todos = this.state.todos
        todos.find(isUpdatedTodo).body = todoBody
        this.setState({todos: todos, editingTodoId: null, editing: null})
    })
}
editTodo(todo){
  this.setState({
    editingTodoId: todo._id
  })
}
render(){
  return (
    <div className='TodosContainer'>
      <h2>This is the Todos Container</h2>
      <Todos
        todos={this.state.todos}
        editingTodoId={this.state.editingTodoId}
        onEditTodo={this.editTodo.bind(this)}
        onDeleteTodo={this.deleteTodo.bind(this)} />
      <CreateTodoForm
        createTodo={this.createTodo.bind(this)} />
    </div>
  )
}
```








```js
//Todo.js
//...
console.log(`${this.props.todo.body} is being edited`);
return (
  <TodoForm
    autoFocus={true}
    onUpdateTodo={this.props.onUpdateTodo}
    buttonName="Update Todo!"/>
)
//...
```







In `containers/TodosContainer.js`:

```js
updateTodo(todoBody) {
    var todoId = this.state.editingTodoId
    function isUpdatedTodo(todo) {
        return todo._id === todoId;
    }
    TodoModel.update(todoId, todoBody).then((res) => {
        let todos = this.state.todos
        todos.find(isUpdatedTodo).body = todoBody
        this.setState({todos: todos, editingTodoId: null, editing: null})
    })
}
editTodo(todo){
  this.setState({
    editingTodoId: todo._id
  })
}
render(){
  return (
    <div className='TodosContainer'>
      <h2>This is the Todos Container</h2>
      <Todos
        todos={this.state.todos}
        editingTodoId={this.state.editingTodoId}
        onEditTodo={this.editTodo.bind(this)}
        onDeleteTodo={this.deleteTodo.bind(this)} />
      <CreateTodoForm
        createTodo={this.createTodo.bind(this)} />
    </div>
  )
}
```

Why would we add editingTodoId to the container? Why might the container be aware of a ***single*** todo ID, in the context of an edit?

In `components/TodoList.js`, add `editingTodoId` and `onEditTodo` to `<Todo>` props:


```js
//....
let todos = this.props.todos.map( (todo) => {
  return (
    <Todo
      key={todo._id}
      todo={todo}
      editingTodoId={this.props.editingTodoId}
      onEditTodo={this.props.onEditTodo}
      onDeleteTodo={this.props.onDeleteTodo}
      onUpdateTodo={this.props.onUpdateTodo}
    />
  )
})
//...
```

 Todo changes
In `components/Todo.js` We need to use this method:

```js
render(){
    if (this.props.editingTodoId === this.props.todo._id){
      console.log(`${this.props.todo.body} is being edited`);
    }
    return(
      <p data-todos-index={this.props.todo._id}>
        <span onClick={() => this.props.onEditTodo(this.props.todo)}>
          {this.props.todo.body}
        </span>
        <span
          className='deleteButton'
          onClick={ () => this.props.onDeleteTodo(this.props.todo) }>
            (X)
        </span>
      </p>
    )
  }
```

Now we can test out our props-flow by clicking on a todo and triggering a `console.log`.


### Breaking it Down:

#### Trickling Down

In `TodosContainer`, a method called `editTodo` is setting the `state` of the `<TodosContainer>` component to include a property called `editingTodoId`. That `state` is then ultimately handed down  to the `<Todo>` component. This state trickles down from `<TodosContainer>` to `<Todo>` as props.

#### Bubbling Up (and then Trickling Back Down again)

How are we passing in the corresponding `todo` id back up to `TodosContainer`? The TodosContainer-state is being updated with a particular `todo` id, which is a `prop` of the `<Todo>` component.

It's being passed an argument to a function that **is defined in** and **trickles down from** `TodosContainer`, to here, in `components/Todo.js`:

```js
<span onClick={() => this.props.onEditTodo(this.props.todo)}>
```

Elsewhere, over in `containers/TodosContainer.js`:

```js
render(){
  return (
    <div className='TodosContainer'>
      <h2>This is the Todos Container</h2>
      <Todos
        todos={this.state.todos}
        editingTodoId={this.state.editingTodoId}
        onEditTodo={this.editTodo.bind(this)}
        onDeleteTodo={this.deleteTodo.bind(this)} />
      <CreateTodoForm
        createTodo={this.createTodo.bind(this)} />
    </div>
  )
}
```

This certainly the trickiest part of the lesson-- the rest is easy by comparison (still pretty tough, at first!).

### Replacing the `console.log` with a Form for editing Todos

The next steps here involve composing a form in place of where we have that `console.log` in `src/components/Todo.js`.

You should replace it with something like this:

```js
return (
  <TodoForm
    autoFocus={true}
    buttonName="Update Todo!"
    onTodoAction={this.props.onUpdateTodo} />
)
```

You will then have to both write that component and then import it into `components/Todo.js`:

```js
// src/components/TodoForm.js
import React, {Component} from 'react'

class TodoForm extends Component {
  onChange(event) {
    this.setState({
      todo: event.target.value
    })
  }
  onSubmit(event){
    event.preventDefault()
    var todo = this.state.todo
    console.log("todo is", todo)
    this.props.onUpdateTodo(todo)
    this.setState({
      todo: ""
    })
  }
  render(){
    return (
      <div className='todoForm'>
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            autoFocus={this.props.autoFocus}
            onChange={e => this.onChange(e)}
            placeholder='Write a todo here ...'
            type='text'
            value={(this.state && this.state.todo) || ''} />
          <button type='submit'>{this.props.buttonName}</button>
        </form>
      </div>
    )
  }
}

export default TodoForm

```

```js
//Todo.js
//...
console.log(`${this.props.todo.body} is being edited`);
return (
  <TodoForm
    autoFocus={true}
    onUpdateTodo={this.props.onUpdateTodo}
    buttonName="Update Todo!"/>
)
//...
```

```js
//Todos.js
let todos = this.props.todos.map( (todo) => {
  return (
    <Todo
      key={todo._id}
      todo={todo}
      editingTodoId={this.props.editingTodoId}
      onEditTodo={this.props.onEditTodo}
      onDeleteTodo={this.props.onDeleteTodo}
      onUpdateTodo={this.props.onUpdateTodo}
    />
  )
})
//...
```

In `models/Todo.js` add our method:

```js
static update(todoId, todoBody) {
    let request = axios.put(`https://super-crud.herokuapp.com/todos/${todoId}`, {
        body: todoBody
    })
    return request
}
```

Think back to what we did for the other CRUD actions--we define some axios behavior in `/models/Todo.js`. Then we define a method in `TodosContainer` that will handle update behavior.

Then we make our way down from `TodosContainer` to `Todos` to `Todo`, with `state` trickling down as `props`.

## Conclusion

We've learned how to do full CRUD for a basic todo app! We've seen in particular how props can be trickled down through parent and child components to make a very modular app. We've also been introduced to the magic of axios for network calls from our frontend.


3.















```js
// src/components/EditTodoForm.js
import React, {Component} from 'react'

class EditTodoForm extends Component {
  onChange(event) {
    this.setState({
      todo: event.target.value
    })
  }
  onSubmit(event){
    event.preventDefault()
    var todo = this.state.todo
    console.log("todo is", todo)
    this.props.onUpdateTodo(todo)
    this.setState({
      todo: ""
    })
  }
  render(){
    return (
      <div className='editTodoForm'>
        <form onSubmit={event => this.onSubmit(event)}>
          <input
            autoFocus={this.props.autoFocus}
            onChange={event => this.onChange(event)}
            placeholder='Write updated todo here...'
            type='text'
            value={(this.state && this.state.todo) || ''} />
          <button type='submit'>{this.props.buttonName}</button>
        </form>
      </div>
    )
  }
}

export default EditTodoForm
``` -->
