var Config = {
  apiUrl:  (window.location.hostname === 'localhost' ? 'https://dev.macrostrat.org/api/v2' : (window.location.origin + '/api/v2')),
  geodeepdiveURL: 'https://geodeepdive.org/api/v1/',
  mapzenAPIKey: 'mapzen-8r7Djkb',
  mapboxAutocompleteAPIKey: 'pk.eyJ1IjoiamN6YXBsZXdza2kiLCJhIjoiY2pjMjBiYWRjMDh2ZzJ4cHIwMjdyeWpieCJ9.EO2U9fSUuSPFvJ8LBQ4QSg'
}

export default Config;
