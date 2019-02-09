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
    // console.log("item is ", item)
    // console.log(item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    // return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

/*
const isSearched = (searchTerm) => (item) =>
!searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
*/
const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';
const DEFAULT_TAG = 'comment';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const PARAM_TAGS = 'tags=';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
    };

    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    console.log("oldHits are ", oldHits)
    console.log("updatedHits array are ", updatedHits)
    console.log("results are ", results)
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
    console.log("After settings results state ", this.state.results)
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    console.log("this.state.results are ", this.state.results)

    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault();
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
          <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}
            >
              Search
            </Search>
          </div>
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
              More
            </Button>
          </div>
      </div>
    );
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({ list, onDismiss }) =>
  <div className="table">
    { list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       results: null,
//       searchKey: '',
//       list:'',
//       searchTerm: DEFAULT_QUERY,
//       tag: DEFAULT_TAG
//     };

//     // or above statement can be written like this as well since varaible name
//     // and state property name are same i.e list
//     /*this.state = {
//       list,
//     }*/
//     this.onDismiss = this.onDismiss.bind(this);
//     this.onSearchChange = this.onSearchChange.bind(this);
//     this.onSearchChange1 = this.onSearchChange1.bind(this);
//     this.setSearchTopstories = this.setSearchTopstories.bind(this);
//     this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
//     this.onSearchSubmit = this.onSearchSubmit.bind(this);
//     this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
//   }

//   needsToSearchTopStories(searchTerm) {
//     return !this.state.results[searchTerm];
//   }
  
//   onSearchSubmit(event) {
//     const { searchTerm } = this.state;
//     this.setState({ searchKey: searchTerm });

//     if(this.needsToSearchTopStories(searchTerm)) {
//       this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
//     }

//     this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE, this.state.tag);
//     event.preventDefault();
//   }

//   setSearchTopstories(result) {
//     const { hits, page } = result;
//     const { searchKey, results } = this.state;

//     // const oldHits = page !== 0? this.state.result.hits: [];
//     const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
//     console.log("oldHits are ", oldHits)
//     const updatedHits = [
//       ...oldHits,
//       ...hits
//     ]
//     console.log("updatedHits are ", updatedHits)
//     console.log("results are ", this.state.results)
//     this.setState({
//       results: {
//         ...results,
//         [searchKey]: { hits: updatedHits, page}
//       }
//     });
//   }

//   fetchSearchTopstories(searchTerm, page, tag) {
//     fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
//       .then(response => {
//         var a = response.json(); 
//         return a
//       })
//       .then(result => { console.log(result); this.setSearchTopstories(result)});
//   }

//   componentDidMount() {
//     const { searchTerm } = this.state;
//     this.setState({ searchKey: searchTerm });
//     this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
//   }

//   onSearchChange(event) {
//     this.setState({ searchTerm: event.target.value, tag: event.target.value })
//   }

//   onSearchChange1(event) {
//     this.setState({ tag: event.target.value })
//   }

//   onDismiss(id) {
//     // console.log(id)
//     const { searchKey, results } = this.state;
//     const { hits, page } = results[searchKey];

//     const isNotId = item => item.objectID !== id;
//     console.log("this.state.results.hits is", this.state.results)
//     const updatedHits = hits.filter(isNotId);

//     this.setState({
//       results: { 
//         ...results, 
//         [searchKey]: { hits: updatedHits, page }
//       }
//     })
//     // this.setState({
//     //   result: Object.assign({}, this.state.result, { hits: updatedHits })
//     // })
//     // const updatedList = this.state.list.filter(isNotId);
//     // this.setState({ list: updatedList });

//     /* Or above line of code can be rewritten in one line as well but it might get
//     less readable */

//     /*const updatedList = this.state.list.filter( item => item.objectID !== id)*/
//   }

//   render() {
//     var helloworld = "Welcome to React";
//     var obj = {name: "Purnima", lastname: "Gupta"}

    
//     const { searchTerm, results, searchKey } = this.state;
//     // const page = ( results && results.page ) || 0;
//     // if(!result) { return null; }
//     const page = (
//       results && 
//       results[searchKey] &&
//       results[searchKey].page
//     ) || 0;

//     const list = (
//       results &&
//       results[searchKey] &&
//       results[searchKey].hits
//     ) || [];

//     return (
//       <div className="page">
//         <div className="interactions">
//             <Search
//               value={searchTerm}
//               onChange={this.onSearchChange}
//               onSubmit={this.onSearchSubmit}
//               onChange1={this.onSearchChange1}
//             >
//             Search
//             </Search>
//           </div>
//           { results &&
//             <Table
//             list={list}
//             // pattern={searchTerm}
//             onDismiss={this.onDismiss}
//           />
//           }
//           <div className="interactions">
//             <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1
//             )}>
//             More
//             </Button>
//           </div>
//       </div>
//     );
//   }
// }

// class Search extends Component {
//   render() {
//     const { value, onChange, children, onSubmit, onChange1 } = this.props;
//     return (
//       <form onSubmit={onSubmit}>
//         <input type="text"
//           type="text"
//           value={value}
//           onChange={onChange}
//         />
//         <button type="submit">
//           {children}
//         </button>
//       </form>
//     )
//    }
// }

// class Table extends Component {
//   render() {
//     const {  onDismiss, list } = this.props;
//     return (
//       <div className="table">
//         {
//           list.filter(isSearched(pattern)).map( item => 
//           list.map( item => 
//             <div key={item.objectID} className="table-row">
//               <span style={{ width: "40%" }}>
//                 <a href={item.url}>{item.title}</a>
//               </span>
//               <span style={{ width: "30%" }}>{item.author}</span>
//               <span style={{ width: "10%" }}>{item.num_comments}</span>
//               <span style={{ width: "10%" }}>{item.points}</span>
//               <span style={{ width: "10%" }}>
//                 <Button
//                   onClick={ () => onDismiss(item.objectID)}
//                   className="button-inline"
//                 >
//                 Dismiss
//                 </Button>
//               </span>
//             </div>
//           )
//         }
//       </div>
//     )
//   }
// }

// class Button extends Component {
//   render() {
//     const {
//       onClick,
//       className = '',
//       children
//     } = this.props;
  
//     return (
//       <button 
//         onClick={onClick}
//         className={className}
//         type="button"
//       >
//       {children}
//       </button>
//     )
//   }
// }
// export default App;
