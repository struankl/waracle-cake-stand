import { isResponseOk } from './utils';

export default async (id) => {
  const response = await fetch(`http://localhost:8080/cakes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  if (!isResponseOk(response)) {
    throw new Error('Error loading cake');
  }
  return response.json();
};
