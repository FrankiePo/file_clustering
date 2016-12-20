#!/usr/bin/env bash

npm install
cp node_modules/angular/angular.min.js libs/angular.min.js
cp node_modules/ngmap/build/scripts/ng-map.min.js libs/ng-map.min.js
cp node_modules/js-marker-clusterer/src/markerclusterer_compiled.js libs/markerclusterer.min.js
