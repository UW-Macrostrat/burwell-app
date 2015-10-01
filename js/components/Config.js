var Config = {
  apiUrl:  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v2' : (window.origin + '/api/v2'))
}

export default Config;
