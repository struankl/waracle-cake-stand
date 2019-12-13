import { isResponseOk } from './utils';

export default async () => {
  const response = await fetch('http://localhost:8080/cakes', {
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
