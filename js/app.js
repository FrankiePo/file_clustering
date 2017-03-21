/**
 * Created by frankiepo on 20/12/2016.
 */
(function(angular) {
    "use strict";
    const app = angular.module('FileClustering', ['ngMap']);
    app.factory('Items', ['$http', function($http) {
        const request = $http.get('htc_one_data.json');
        return {
            getItems: () => request.then(res => res.data.items),
            getTitles: () => request.then(res => res.data.titles)
        }
    }]);
    app.constant('MapCfg', {
        mcOptions: {
            imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'
        },
        thumbnailsPath: (filename) => `images/thumbnails/thumbnail_50_50_${filename}`,
    });
    app.controller('MapController', ['NgMap', 'Items', 'MapCfg', '$scope',
        function(NgMap, Items, MapCfg, $scope) {
            Items.getItems().then(items => $scope.items = items);
            // Items.getTitles().then(titles => $scope.titles = titles);
            NgMap.getMap().then(function(map) {
                $scope.markerClusterer = new MarkerClusterer(map, [], MapCfg.mcOptions);
                $scope.$watchGroup(['items', 'searchString'], function (newValues, oldValues, scope) {
                    if (!scope.items) return;
                    const withGeo = item => item.geo;
                    const withString = item => (!scope.searchString) ? true : item.file.includes(scope.searchString);
                    const createMarker = item => new google.maps.Marker({
                        position: new google.maps.LatLng(item.geo[0], item.geo[1]),
                        title: item.file,
                        icon: MapCfg.thumbnailsPath(item.file),
                    });
                    scope.markers = scope.items
                        .filter(withGeo)
                        .filter(withString)
                        .map(createMarker);
                });
                $scope.$watch('markers', function(newValues, oldValues, scope) {
                    if (!scope.markers) return;
                    const mc = scope.markerClusterer;
                    mc.clearMarkers();
                    mc.addMarkers(scope.markers);
                    mc.fitMapToMarkers();
                });
            });
        }]);
}) (angular);