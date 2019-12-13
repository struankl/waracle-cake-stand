export default (response) => response.ok && Math.floor(response.status / 100) === 2;
