var Config = {
  apiUrl:  (window.location.hostname === 'localhost' ? 'https://dev.macrostrat.org/api/v2' : (window.location.origin + '/api/v2')),
  geodeepdiveURL: 'https://geodeepdive.org/api/v1/',
  mapzenAPIKey: 'search-XqIWDVM'
}

export default Config;
