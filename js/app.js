/**
 * Created by frankiepo on 20/12/2016.
 */
(function(angular) {
    "use strict";
    const app = angular.module('FileClustering', ['ngMap']);
    app.controller('MapController', ['NgMap', '$scope', '$http', "$filter",
        function(NgMap, $scope, $http) {
            (function() {
                const request = {
                    url: 'htc_one_data.json',
                    method: "GET"
                };
                $http(request).then(function(res) {
                    $scope.items = res.data.items;
                    $scope.titles = res.data.titles;
                });
            }) ();
            NgMap.getMap().then(function(map) {
                $scope.map = map;
                const mcOptions = { imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' };
                $scope.markerClusterer = new MarkerClusterer(map, [], mcOptions);
                $scope.$watchGroup(['items', 'searchString'], function (newValues, oldValues, scope) {
                    const withGeo = item => item.geo;
                    const withString = item => (!$scope.searchString) ? true : item.file.includes($scope.searchString);
                    const createMarker = item => new google.maps.Marker({
                        position: new google.maps.LatLng(item.geo[0], item.geo[1]),
                        title: item.file,
                        icon: `images/thumbnails/thumbnail_50_50_${item.file}`
                    });
                    scope.markers = scope.items && scope.items.filter(withGeo).filter(withString).map(createMarker);
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