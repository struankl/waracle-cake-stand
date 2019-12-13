import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent, act } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import ViewCake from './ViewCake';
import * as apis from '../../api';


jest.mock('../../api', () => ({
  loadCake: jest.fn(),
  updateCake: jest.fn(),
  addCake: jest.fn()
}));

const renderWithRoute = (history = createMemoryHistory({ initialEntries: ['/2'] })) => render(
  <Router history={history}>
    <Switch>
      <Route path="/new">
        <ViewCake/>
      </Route>
      <Route path="/:cakeId">
        <ViewCake/>
      </Route>
      <Route path="/">
        <div>Home Page</div>
      </Route>
    </Switch>
  </Router>,
);
describe('ViewCake', () => {
  beforeEach(() => {
    apis.loadCake.mockReset();
    apis.updateCake.mockReset();
    apis.addCake.mockReset();
  });

  describe('Loading and error states', () => {
    test('renders loading text', async () => {
      apis.loadCake.mockImplementation(() => new Promise(() => {
      }));
      const { getByText } = renderWithRoute();
      const loadingElement = getByText('Loading...');
      expect(loadingElement)
        .toBeInTheDocument();
      expect(apis.loadCake)
        .toHaveBeenCalledTimes(1);
      expect(apis.loadCake)
        .toHaveBeenCalledWith('2');
    });

    test('renders loading text', async () => {
      apis.loadCake.mockImplementation(() => {
        throw new Error('');
      });
      const { getByText } = renderWithRoute();
      const errorElement = getByText('Sorry there was an error loading the cake');
      expect(errorElement)
        .toBeInTheDocument();
      expect(apis.loadCake)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('cake loaded', () => {
    beforeEach(() => {
      apis.loadCake.mockResolvedValue(
        {
          id: 2,
          name: 'Carrot',
          comment: 'Too many veg',
          yumFactor: 2,
          imageUrl: 'http://cake-pics.com/carrot.jpg',
        },
      );
    });

    test('edit button makes text fields editable - cancel reverses', async () => {
      const { getByText, getByTestId } = renderWithRoute();

      const loadingElement = getByText('Loading...');
      expect(loadingElement)
        .toBeInTheDocument();
      await waitForElementToBeRemoved(() => getByText('Loading...'));
      expect(apis.loadCake)
        .toHaveBeenCalledTimes(1);


      let title = getByTestId('name-input');
      let comment = getByTestId('comment-input');
      let imageUrl = getByTestId('imageUrl-input');

      expect(title)
        .toBeInTheDocument();
      expect(comment)
        .toBeInTheDocument();
      expect(imageUrl)
        .toBeInTheDocument();

      expect(title.value)
        .toBe('Carrot');
      expect(comment.value)
        .toBe('Too many veg');
      expect(imageUrl.value)
        .toBe('http://cake-pics.com/carrot.jpg');

      expect(title.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(comment.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(imageUrl.getAttribute('readOnly'))
        .not
        .toBe(null);

      act(() => {
        fireEvent.click(getByText(/Edit/i));
      });

      title = getByTestId('name-input');
      comment = getByTestId('comment-input');
      imageUrl = getByTestId('imageUrl-input');

      expect(title.getAttribute('readOnly'))
        .toBe(null);
      expect(comment.getAttribute('readOnly'))
        .toBe(null);
      expect(imageUrl.getAttribute('readOnly'))
        .toBe(null);

      act(() => {
        fireEvent.click(getByText(/Cancel/i));
      });

      await waitForElementToBeRemoved(() => getByText('Loading...'));

      expect(apis.loadCake)
        .toHaveBeenCalledTimes(2);

      title = getByTestId('name-input');
      comment = getByTestId('comment-input');
      imageUrl = getByTestId('imageUrl-input');

      expect(title.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(comment.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(imageUrl.getAttribute('readOnly'))
        .not
        .toBe(null);
    });

    test('back button returns to home page', async () => {
      const history = createMemoryHistory({ initialEntries: ['/3'] });
      const { getByText } = renderWithRoute(history);

      const loadingElement = getByText('Loading...');
      expect(loadingElement)
        .toBeInTheDocument();
      await waitForElementToBeRemoved(() => getByText('Loading...'));
      act(() => {
        fireEvent.click(getByText('Back'));
      });
      expect(history.location.pathname)
        .toBe('/');
    });

    test('save button saves current fields', async () => {
      apis.updateCake.mockResolvedValue(
        {
          id: 2,
          name: 'Victoria Sponge',
          comment: 'Fluffy',
          yumFactor: 5,
          imageUrl: 'http://cake-pics.com/sponge.jpg',
        },
      );
      const history = createMemoryHistory({ initialEntries: ['/2'] });
      const { getByText, getByTestId } = renderWithRoute(history);

      await waitForElementToBeRemoved(() => getByText('Loading...'));
      act(() => {
        fireEvent.click(getByText('Edit'));
      });

      let title = getByTestId('name-input');
      let comment = getByTestId('comment-input');
      let imageUrl = getByTestId('imageUrl-input');

      act(() => {
        fireEvent.change(title, { target: { value: 'Fruit Cake' } });
        fireEvent.change(comment, { target: { value: 'Well, it\'s fruity' } });
        fireEvent.change(imageUrl, { target: { value: 'http://cake-pics.com/fruit.jpg' } });
      });

      act(() => {
        fireEvent.click(getByText('Save'));
      });

      await waitForElementToBeRemoved(() => getByText('Loading...'));
      expect(apis.updateCake)
        .toHaveBeenCalledWith(2, {
          name: 'Fruit Cake',
          comment: 'Well, it\'s fruity',
          imageUrl: 'http://cake-pics.com/fruit.jpg',
          yumFactor: 2,
          id: 2,
        });

      title = getByTestId('name-input');
      comment = getByTestId('comment-input');
      imageUrl = getByTestId('imageUrl-input');

      expect(title.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(comment.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(imageUrl.getAttribute('readOnly'))
        .not
        .toBe(null);

      expect(title.value)
        .toBe('Victoria Sponge');
      expect(comment.value)
        .toBe('Fluffy');
      expect(imageUrl.value)
        .toBe('http://cake-pics.com/sponge.jpg');
    });
  });

  describe('new cake', () => {

    test('cancel button returns to home page', async () => {
      const history = createMemoryHistory({ initialEntries: ['/new'] });
      const { getByText } = renderWithRoute(history);

      act(() => {
        fireEvent.click(getByText('Cancel'));
      });
      expect(history.location.pathname)
        .toBe('/');
    });

    test('save button saves current fields', async () => {
      apis.addCake.mockResolvedValue(
        {
          id: 2,
          name: 'Victoria Sponge',
          comment: 'Fluffy',
          yumFactor: 5,
          imageUrl: 'http://cake-pics.com/sponge.jpg',
        },
      );
      const history = createMemoryHistory({ initialEntries: ['/new'] });
      const { getByText, getByTestId } = renderWithRoute(history);

      let title = getByTestId('name-input');
      let comment = getByTestId('comment-input');
      let imageUrl = getByTestId('imageUrl-input');

      act(() => {
        fireEvent.change(title, { target: { value: 'Fruit Cake' } });
        fireEvent.change(comment, { target: { value: 'Well, it\'s fruity' } });
        fireEvent.change(imageUrl, { target: { value: 'http://cake-pics.com/fruit.jpg' } });
      });

      act(() => {
        fireEvent.click(getByText('Save'));
      });

      await waitForElementToBeRemoved(() => getByText('Loading...'));
      expect(apis.addCake)
        .toHaveBeenCalledWith({
          name: 'Fruit Cake',
          comment: 'Well, it\'s fruity',
          imageUrl: 'http://cake-pics.com/fruit.jpg',
          yumFactor: 0,
          id: undefined,
        });

      title = getByTestId('name-input');
      comment = getByTestId('comment-input');
      imageUrl = getByTestId('imageUrl-input');

      expect(title.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(comment.getAttribute('readOnly'))
        .not
        .toBe(null);
      expect(imageUrl.getAttribute('readOnly'))
        .not
        .toBe(null);

      expect(title.value)
        .toBe('Victoria Sponge');
      expect(comment.value)
        .toBe('Fluffy');
      expect(imageUrl.value)
        .toBe('http://cake-pics.com/sponge.jpg');

      expect(history.location.pathname)
        .toBe('/2');
    });
  });
});
