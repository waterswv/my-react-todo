// src/components/EditTodoForm.js
import React, {
  Component
} from 'react'

class EditTodoForm extends Component {

  constructor() {
    // use Component's constructor
    super()
    // set initial state
    this.state = {
      updatedTodoBody: ''
    }
  }

  onInputChange(event) {
    console.log('changing a todo!')
    this.setState({
      updatedTodoBody: event.target.value
    })
  }

  onFormSubmit(event) {
    event.preventDefault()
    console.log('edit todo form submitted');
    this.props.onUpdateTodo(this.state.updatedTodoBody)
    this.setState({
      updatedTodoBody: ''
    })
  }

  render() {
    return ( <
      div className = 'editTodoForm' >
      <
      form onSubmit = {
        event => this.onFormSubmit(event)
      } >
      <
      input onChange = {
        event => this.onInputChange(event)
      }
      placeholder = 'Write updated todo here...'
      type = 'text'
      value = {
        this.state.updatedTodoBody
      }
      /> <
      button type = 'submit' > Update Todo! < /button> <
      /form> <
      /div>
    )
  }
}

export default EditTodoForm
