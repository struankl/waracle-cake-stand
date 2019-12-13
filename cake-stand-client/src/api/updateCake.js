import { isResponseOk } from './utils';
import { CAKE_STAND_SERVER } from '../config';

export default async (id, cake) => {
  const response = await fetch(`${CAKE_STAND_SERVER}/cakes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(cake),
  });
  if (!isResponseOk(response)) {
    throw new Error('Error saving cake');
  }
  return response.json();
};
