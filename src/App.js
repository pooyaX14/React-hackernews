import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faIgloo, faSpinner, faAddressBook } from '@fortawesome/free-solid-svg-icons'
// library.add(faIgloo, faSpinner, )


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
const DEFAULT_HPP = '10';
const DEFAULT_TAG = 'comment';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const PARAM_TAGS = 'tags=';

const SORTS = {
  NONE: list => {//console.log(list);
    return list},
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ 
      sortKey: sortKey,
      isSortReverse: isSortReverse
    })
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
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
      isLoading: false
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    this.setState({ isLoading: true })
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

    // console.log("this.state.results are ", this.state.results)

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
      searchKey,
      isLoading,
      sortKey,
      isSortReverse
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
            sortKey={sortKey}
            onSort={this.onSort}
            isSortReverse={isSortReverse}
            onDismiss={this.onDismiss}
          />
          <div className="interactions">
            <ButtonWithLoading
              // isLoading={isLoading}
              onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
              >
              More
            </ButtonWithLoading>
          </div>
      </div>
    );
  }
}
//  { isLoading
//               ? <Loading/>
//               : <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
//                 More
//                 </Button>
// }
          
const Loading = () => 
  // (<FontAwesomeIcon icon="address-book-o" size="8x"/>)
  <i className="fas fa-spinner " style={{fontSize: '100px'}}></i>

class Search extends Component {
  constructor(props) {
    super(props);  
  }
  componentDidMount() {
    if(this.input) {
      this.input.focus()
    }
  }
  render() {
    const { 
      value,
      onChange,
      onSubmit,
      children
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => { this.input = node; }}
          // ref={this.setRefs}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    )
  }
}

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node
}

const Table = ({ list, onDismiss, sortKey, onSort, isSortReverse }) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList

  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
            activeSortKey={sortKey} 
          >
          Title
          </Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
          Author
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
          Comments
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'POINTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
          Points
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          Archive
        </span>  
      </div>
    { reverseSortedList.map(item =>
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
  );
}
const Sort = ({ sortKey, onSort, children, activeSortKey}) => {
  // const sortClass = ['button-inline'];
  // if(sortKey === activeSortKey) {
  //   sortClass.push('button-active');
  // }
  const sortClass = classNames('button-inline',
                                {'button-active': sortKey === activeSortKey}
                              );
  return (
    <Button 
      onClick={() => onSort(sortKey)}
      //className={sortClass.join(' ')}
      className={sortClass}
      >
      {children}
    </Button>
  )
}


Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

// const Button = ({ onClick, className='', children }) =>
//   <button
//     onClick={onClick}
//     className={className}
//     type="button"
//   >
//     {children}
//   </button>

  // Button.propTypes = {
  //   onClick: PropTypes.func.isRequired,
  //   className: PropTypes.string,
  //   children: PropTypes.node.isRequired,
  // };

  const withLoading = (Component) => ({ isLoading, ...rest}) => {
    // console.log(isLoading);
    // console.log(rest);
    return isLoading ? <Loading /> : <Component {...rest} />
  }
// ---------------------------------------------------------------------------------------------------------
  // const withLoading = (WrappedComponent) => {
  //   class HOC extends React.Component {
  //     render() {
  //         const { isLoading } = this.props
  //          return (
  //            isLoading ? <Loading /> : <WrappedComponent {...this.props}/>
  //          );
  //        }
  //      }
  //      return HOC;
  // }

  // export default withLoading;

  class Button extends React.Component {
    render() {
    const { onClick, className='', children} = this.props
    
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

  // export default WrappedComponent;

  // <WrappedComponent
    // isLoading={isLoading}
    // onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
    // >
    // More
  // </WrappedComponent>

//---------------------------------------------------------------------------------------------------------  
  const ButtonWithLoading = withLoading(Button);
  console.log(ButtonWithLoading);
  
  // Button.defaultProps = {
  //   className: '',
  // }
export default App;

export { Button, Search, Table };
