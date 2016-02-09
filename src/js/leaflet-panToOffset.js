/* Via https://gist.github.com/missinglink/7620340 */
L.Map.prototype.panToOffset = function (latlng, offset, options) {
  var x = this.latLngToContainerPoint(latlng).x - offset[0],
      y = this.latLngToContainerPoint(latlng).y - offset[1],
      point = this.containerPointToLatLng([x, y]),
      opts = (options) ? options : {"animate": true, "duration": 0.6, "noMoveStart": true};

  return this.setView(point, this._zoom, { pan: opts });
};
