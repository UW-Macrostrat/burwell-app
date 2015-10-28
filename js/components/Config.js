var Config = {
  apiUrl:  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v2' : (window.location.origin + '/api/v2')),
  geodeepdiveURL: 'https://geodeepdive.org/api/v1/' 
}

export default Config;
