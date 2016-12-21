#!/usr/bin/env bash

npm install
cp node_modules/angular/angular.min.js libs/angular.min.js
cp node_modules/ngmap/build/scripts/ng-map.min.js libs/ng-map.min.js
cp node_modules/js-marker-clusterer/src/markerclusterer_compiled.js libs/markerclusterer.min.js
cp node_modules/angularjs-slider/dist/rzslider.min.css libs/rzslider.min.css
cp node_modules/angularjs-slider/dist/rzslider.min.js libs/rzslider.min.js
cp node_modules/moment/min/moment-with-locales.min.js libs/moment-with-locales.min.js
cp node_modules/moment-range/dist/moment-range.min.js libs/moment-range.min.js
