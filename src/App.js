import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.gitub.io/react',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1
//   },
//   { 
//     title: 'Purnima    ',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Purnima Gupta, Purnima Gupta',
//     num_comments: 2,
//     points: 5,
//     objectID: 2
//   }
// ];

function isSearched(searchTerm) {
  console.log("searchTerm is ", searchTerm)
  return function(item) {
    console.log("item is ", item)
    console.log(item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    // return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

/*
const isSearched = (searchTerm) => (item) =>
!searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
*/
const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list:'',
      searchTerm: DEFAULT_QUERY,
      result: null
    };

    // or above statement can be written like this as well since varaible name
    // and state property name are same i.e list
    /*this.state = {
      list,
    }*/
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({
      result
    })
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => {
        var a = response.json(); 
        return a
      })
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onSearchChange(event) {
    console.log("event inside onSearchChange", event)
    console.log("target inside onSearchChange", event.target)
    // console.log("value inside onSearchChange", value)
    this.setState({ searchTerm: event.target.value })
  }

  onDismiss(id) {
    console.log(id)
    const isNotId = item => item.objectID !== id;
    console.log("this.state.result.hits is", this.state.result.hits)

    // const updatedList = this.state.list.filter(isNotId);
    // this.setState({ list: updatedList });

    /* Or above line of code can be rewritten in one line as well but it might get
    less readable */

    /*const updatedList = this.state.list.filter( item => item.objectID !== id)*/
  }

  render() {
    var helloworld = "Welcome to React";
    var obj = {name: "Purnima", lastname: "Gupta"}

    
    const { searchTerm, result } = this.state;

    if(!result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
            >
            Search
            </Search>
          </div>
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { value, onChange, children } = this.props;
    return (
      <form>
        {children} <input 
          type="text"
          value={value}
          onChange={onChange}/>
      </form>
    )
   }
}

class Table extends Component {
  render() {
    const {  pattern, onDismiss, list } = this.props;
    return (
      <div className="table">
        {
          list.filter(isSearched(pattern)).map( item => 
            <div key={item.objectID} className="table-row">
              <span style={{ width: "40%" }}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={{ width: "30%" }}>{item.author}</span>
              <span style={{ width: "10%" }}>{item.num_comments}</span>
              <span style={{ width: "10%" }}>{item.points}</span>
              <span style={{ width: "10%" }}>
                <Button
                  onClick={ () => onDismiss(item.objectID)}
                  className="button-inline"
                >
                Dismiss
                </Button>
              </span>
            </div>
          )
        }
      </div>
    )
  }
}

class Button extends Component {
  render() {
    const {
      onClick,
      className = '',
      children
    } = this.props;
  
    return (
      <button 
        onClick={onClick}
        className={className}
        type="button"
      >
      {children}
      </button>
    )
  }
}
export default App;
