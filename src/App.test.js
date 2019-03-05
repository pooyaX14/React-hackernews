import React from 'react';
import ReactDOM from 'react-dom';
import App, { Search, Button, Table } from './App';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });
Enzyme.configure({ adapter: new Adapter() });
describe('App', () => {
	it('renders', () => {
		const div = document.createElement('div');
		ReactDOM.render(<App />, div);
	});

	test('snapshots', () => {
		const component = renderer.create(<App />);
		let tree = component.toJSON();
		// console.log(tree);
		// console.log(component.toTree())
		expect(tree).toMatchSnapshot();
	});
});

describe('Search', () => {
	it('renders', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Search>Search</Search>, div)
		// it("Gives immediate focus on to name field on load", () => {
	});
	// it('shows two items in list', () => {
	// 	const output = mount(<Search/>);
 //    expect(output.getElement('input').node === document.activeElement);
	// });
	it("Gives immediate focus on to name field on load", () => {
    // const wrapper = mount(<Search />);
    // const element = wrapper.instance().input; // This is your input ref

    // spyOn(element, 'focus');

    // //wrapper.simulate('mouseEnter', eventStub());

    // setTimeout(() => expect(element.focus).toHaveBeenCalled(), 250);
    const wrapper = mount(<Search/>);
    const inputRef = wrapper.instance().input;

    jest.spyOn(inputRef, "focus");

    wrapper.instance().componentDidMount();
    expect(inputRef.focus).toHaveBeenCalledTimes(1);
	});
	test('snapshots', () => {
		const component = renderer.create(<Search>Search</Search>)
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('Button', () => {
	it('renders', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Button>More</Button>, div)
	});

	test('snapshots', () => {
		const component = renderer.create(<Button>More</Button>)
		let tree = component.toJSON();
		console.log(tree)
		expect(tree).toMatchSnapshot();
	});
});


describe('Table', () => {
	const props = {
		list: [
			{ title: '1', author: '1', num_comments: 1, points: 2, objectiD: 'y'},
			{ title: '2', author: '2', num_comments: 2, pints: 2, objectID: 'z' },
		]
	}

	it('renders', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Table {...props} />, div)
	});

	test('snapshots', () => {
		const component = renderer.create(<Table {...props} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	});

	it('shows two items in list', () => {
		const element = shallow(<Table { ...props } />)
		expect(element.find('.table-row').length).toBe(2)
	});
})

// describe('Table', () => {
// 	// Enzyme.configure({ adapter: new Adapter() });
// 	const props = {
// 		list: [
// 			{ title: '1', author: '1', num_comments: 1, points: 2, objectiD: 'y'},
// 			{ title: '2', author: '2', num_comments: 2, pints: 2, objectID: 'z' },
// 		]
// 	};

// 	it('shows two items in list', () => {
// 		const element = shallow(<Table { ...props } />)
// 		expect(element.find('.table-row').length).toBe(2)
// 	});
// })