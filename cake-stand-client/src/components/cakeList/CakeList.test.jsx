import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent, act } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import CakeList from './CakeList';
import * as apis from '../../api';


jest.mock('../../api', () => ({
  loadCakes: jest.fn(),
}));

describe('CakeList', () => {
  beforeEach(() => {
    apis.loadCakes.mockReset();
  });

  describe('Loading and error states', () => {
    test('renders loading text', async () => {
      apis.loadCakes.mockImplementation(() => new Promise(() => {
      }));
      const { getByText } = render(<CakeList />);
      const loadingElement = getByText('Loading...');
      expect(loadingElement)
        .toBeInTheDocument();
      expect(apis.loadCakes)
        .toHaveBeenCalledTimes(1);
    });

    test('renders loading text', async () => {
      apis.loadCakes.mockImplementation(() => {
        throw new Error('');
      });
      const { getByText } = render(<CakeList />);
      const errorElement = getByText('Sorry there was an error loading the cakes');
      expect(errorElement)
        .toBeInTheDocument();
      expect(apis.loadCakes)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('cakes loaded', () => {
    beforeEach(() => {
      apis.loadCakes.mockResolvedValue(
        [
          {
            id: 1,
            name: 'Sponge',
            comment: 'fluffy',
            yumFactor: 4,
            imageUrl: 'http://cake-pics.com/sponge.jpg',
          }, {
            id: 2,
            name: 'Carrot',
            comment: 'Too many veg',
            yumFactor: 2,
            imageUrl: 'http://cake-pics.com/carrot.jpg',
          },
        ],
      );
    });

    test('renders cake list', async () => {
      const { getByText } = render(
        <Router history={createMemoryHistory()}>
          <CakeList />
        </Router>,
      );

      const loadingElement = getByText('Loading...');
      expect(loadingElement)
        .toBeInTheDocument();
      await waitForElementToBeRemoved(() => getByText('Loading...'));

      expect(getByText('Sponge'))
        .toBeInTheDocument();
      expect(getByText('Carrot'))
        .toBeInTheDocument();
    });

    test('clicking on cake navigates to cake page', async () => {
      const history = createMemoryHistory();
      const { getByText } = render(
        <Router history={history}>
          <CakeList />
        </Router>,
      );

      const loadingElement = getByText('Loading...');
      expect(loadingElement);
      await waitForElementToBeRemoved(() => getByText('Loading...'));
      act(() => {
        fireEvent.click(getByText('Sponge'));
      });
      expect(history.location.pathname).toEqual('/1');
    });
  });
});
