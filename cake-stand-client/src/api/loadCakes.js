import { isResponseOk } from './utils';
import { CAKE_STAND_SERVER } from '../config';

export default async () => {
  const response = await fetch(`${CAKE_STAND_SERVER}/cakes`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  if (!isResponseOk(response)) {
    throw new Error('Error loading cakes');
  }
  return response.json();
};
