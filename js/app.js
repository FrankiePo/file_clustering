/**
 * Created by frankiepo on 20/12/2016.
 */
(function(angular) {
    "use strict";
    const app = angular.module('FileClustering', ['ngMap']);

    app.controller('MapController', ['NgMap', '$scope', '$rootScope', '$http',
        function(NgMap, $scope, $rootScope, $http) {
            $scope.load_items = function () {
                const request = {
                    url: 'htc_one_data.json',
                    method: "GET"
                };
                $http(request).then(function(res) {
                    $rootScope.items = res.data.items.filter((item) => item.geo);
                    $rootScope.titles = res.data.titles;
                });
            };
            $scope.load_items();
            $scope.createMarkerForItem = function (item) {
                let marker = new google.maps.Marker({
                    position: new google.maps.LatLng(item.geo[0], item.geo[1]),
                    title: item.file
                });
                $scope.bounds.extend(marker.getPosition());
                return marker;
            };
            $scope.initMarkerClusterer = function () {
                let markers = $rootScope.items.map((city) => $scope.createMarkerForItem(city));
                let mcOptions = { imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' };
                return new MarkerClusterer($scope.map, markers, mcOptions);
            };
            NgMap.getMap().then(function(map) {
                $scope.map = map;
                $scope.bounds = new google.maps.LatLngBounds();
                $scope.initMarkerClusterer();
                $scope.map.setCenter($scope.bounds.getCenter());
                $scope.map.fitBounds($scope.bounds);
            });
    }]);
}) (angular);