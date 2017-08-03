## Sprint 5: Deleting Todos

Deleting will work similarly to creating todos, with regard to passing state through props.

1. Update the `Todo` component to contain a UI element to delete a todo.

```js
// src/components/Todo.js
//...
class Todo extends Component {
  render(){
    return(
      <p data-todos-index={this.props.todo._id}>
        <span>{this.props.todo.body}</span>
        <span
          className='deleteButton'
          onClick={() => this.props.onDeleteTodo(this.props.todo)}>
            (X)
        </span>
      </p>
    )
  }
}
```

2. When the `span` with the `X` gets clicked, it calls `this.props.onDeleteTodo`. The parent component of `Todo` will need to pass `.onDeleteTodo` into the `Todo` component. Briefly consider -- what is the parent component of `Todo`?

3. In the `TodoList` class, send `this.props.onDeleteTodo` to each `Todo` component that is rendered by the list.

```js
class TodoList extends Component {
  render(){
    let todoArray = this.props.todos.map( (todo) => {
      return (
        <Todo
          key={todo._id}
          todo={todo}
          onDeleteTodo={this.props.onDeleteTodo} />
      )
    })
```

4. One level further up, in the `TodoContainer` class, create a `deleteTodo` method and pass it into the `TodoList` component.


```js
// src/components/TodosContainer.js
// ...

deleteTodo(todo){
  console.log('deleting todo', todo)
}
render(){
  return (
    <div className='todosContainer'>
      <CreateTodoForm
      createTodo={this.createTodo.bind(this)} />
      <TodoList
        todos={this.state.todos}
        onDeleteTodo={this.deleteTodo.bind(this)} />
    </div>
  )
}
```

5. Instead of logging a message to the console, the `deleteTodo` method should trigger an AJAX call.  There's no method for that in the model yet, though.  Add a `delete` static method to the `TodoModel` class that makes this request.

```js
// src/models/Todo.js
// ...
static delete(todo){
  let request = $.ajax({
    url: `https://super-crud.herokuapp.com/todos/${todo}`,
    method: 'DELETE'
  })
  return request
}
```

6. Fill in the `deleteTodo` method of `TodosContainer` so that it uses the `TodoModel.delete` method to make an AJAX call to the super-crud API and delete the correct todo.

```js
deleteTodo(todo) {
  console.log('deleting todo', todo)
  TodoModel.delete(todo).then((res) => {
      let todos = this.state.todos.filter(function(todo) {
        return todo._id !== res._id
      });
      this.setState({todos})
  })
}
```

7. Think critically about the code for the delete feature. In your own words, explain how the `Todo` component class's `onDeleteTodo` method works.

<details><summary>click </summary>

The <code>onDeleteTodo</code> function calls the <code>deleteTodo</code> method from the todo component's <code>props</code>. This method is actually a method from <code>TodoList</code>. It takes the todo, passed as the function's argument from the child component, up through a chain of references. It deletes the todo with an AJAX call through <code>TodoModel</code>'s static <code>delete</code> method.

After the <code>TodoModel.delete</code> method finishes, back in <code>TodosContainer</code>, all todos are grabbed from the container state. Then, the filter creates a new array that doesn't have the todo that was deleted. Finally, the method updates the state to have only the remaining todos.
</details>
