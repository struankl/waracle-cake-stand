import { isResponseOk } from './utils';

export default async (id) => {
  const response = await fetch(`http://localhost:8080/cakes/${id}`, {
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
