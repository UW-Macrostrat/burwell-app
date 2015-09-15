import React from 'react';

var Attribution = React.createClass({
  hide: function() {
      this.props.onInteraction('showAttribution', false);
  },

  render: function() {
    return (
      <div className={this.props.data.showAttribution ? 'visible attr-container' : 'attr-container'} onClick={this.hide}>
        <div id='attr-info'>
          <div>
            <p><strong>Mapping API </strong> via <a href='http://leafletjs.com' title='A JS library for interactive maps' target='_blank'>Leaflet</a> under <a href='https://github.com/Leaflet/Leaflet/blob/master/LICENSE' target='_blank'>BSD 2-Clause</a>.</p>
            <p><strong>Black & white tiles </strong>by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright' target='_blank'>ODbL</a>.</p>
            <p><strong>Satellite tiles </strong>by <a href='https://www.mapbox.com/about/maps/' target='_blank'>Mapbox</a>. Data by <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright' target='_blank'>ODbL</a>.</p>

            <p><strong>Geologic tiles </strong>by <a href='https://dev.macrostrat.org' target='_blank'>Macrostrat.org</a>, under <a href='https://creativecommons.org/publicdomain/zero/1.0/legalcode' target='_blank'>CC0</a>.</p>

            <p><strong>Data</strong> adapted from various providers as noted, including <a href='http://pubs.usgs.gov/ds/424/' target='_blank'>USGS</a>.</p>

            <p><strong>Code </strong>by <a href='http://dev.macrostrat.org' target='_blank'>Macrostrat</a>, under <a href='https://creativecommons.org/publicdomain/zero/1.0/legalcode' target='_blank'>CC0</a>, and can be found <a href='https://github.com/UW-Macrostrat/gmna-app' target='_blank'>on Github</a>.</p>
            <p><strong>Development team </strong>comprised of <a href='https://github.com/jczaplew' target='_blank'>John Czaplewski</a>, lead developer. <a href='http://strata.geology.wisc.edu' target='_blank'>Shanan Peters</a>, P.I. and scientific lead. Puneet Kishor, initial <a href='http://earth-base.org' target='_blank'>earth-base</a> and literature search development.</p>
            <p><strong>Funding </strong> for core <a href='//macrostrat.org'>Macrostrat</a> development via NSF EAR-1150082, Macrostrat&mdash;geologic map integration via NSF ICER-1440312, and literature integration via NSF ICER-1343760.</p>
            <p><strong>Licence: </strong> all Macrostrat geological data are licensed under a <a href='http://creativecommons.org/licenses/by/4.0/'>Creative Commons Attribution 4.0 International License</a>.</p>
          </div>
        </div>
      </div>
    );
  }
});

export default Attribution;
