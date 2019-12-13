import { isResponseOk } from './utils';

export default async (cake) => {
  const response = await fetch('http://localhost:8080/cakes', {
    method: 'POST',
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
