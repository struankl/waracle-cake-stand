import { isResponseOk } from './utils';
import { CAKE_STAND_SERVER } from '../config';

export default async (id) => {
  const response = await fetch(`${CAKE_STAND_SERVER}/cakes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  if (!isResponseOk(response)) {
    throw new Error('Error deleting cake');
  }
};
