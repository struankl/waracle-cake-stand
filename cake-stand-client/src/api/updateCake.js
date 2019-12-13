import { isResponseOk } from './utils';

export default async (id, cake) => {
  const response = await fetch(`http://localhost:8080/cakes/${id}`, {
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
