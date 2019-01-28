import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.gitub.io/react',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  },
  { 
    title: 'Purnima    ',
    url: 'https://github.com/reactjs/redux',
    author: 'Purnima Gupta, Purnima Gupta',
    num_comments: 2,
    points: 5,
    objectID: 2
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list,
    };

    // or above statement can be written like this as well since varaible name
    // and state property name are same i.e list
    /*this.state = {
      list,
    }*/
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(id) {
    console.log(id)
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });

    /* Or above line of code can be rewritten in one line as well but it might get
    less readable */

    /*const updatedList = this.state.list.filter( item => item.objectID !== id)*/

    this.setState({ list: updatedList })
  }

  render() {
    var helloworld = "Welcome to React";
    var obj = {name: "Purnima", lastname: "Gupta"}
    return (
      <div className="App">
        {
          this.state.list.map((item) => {
            return (
              <div key={item.objectID}>
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>{item.author}</span>
                <span>{item.num_comments}</span>
                <span>{item.points}</span>
                <span>
                  <button
                    onClick={() => this.onDismiss(item.objectID)}
                    type="button"
                  >
                    Dismiss
                  </button>
                </span>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default App;
