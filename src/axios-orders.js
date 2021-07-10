import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://my-burger-react-c54da.firebaseio.com/'
});

export default instance;