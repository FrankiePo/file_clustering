/**
 * Created by frankiepo on 20/12/2016.
 */
(function(angular) {
    "use strict";
    var app = angular.module('FileClustering', ['ngMap']);

    app.controller('MapController', ['NgMap', '$scope', '$rootScope', '$http',
        function(NgMap, $scope, $rootScope, $http) {
            $scope.load_items = function () {
                var request = {
                    url: 'htc_one_data.json',
                    method: "GET"
                };
                $http(request).then(function(res) {
                    $rootScope.items = res.data.items.filter(function(item) {
                        return item.geo;
                    });
                    $rootScope.titles = res.data.titles;
                });
            };
            $scope.load_items();
            $scope.createMarkerForItem = function (item) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(item.geo[0], item.geo[1]),
                    title: item.file
                });
                return marker;
            };
            $scope.initMarkerClusterer = function () {
                var markers = $rootScope.items.map(function (city) {
                    return $scope.createMarkerForItem(city);
                });
                var mcOptions = { imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' };
                return new MarkerClusterer($scope.map, markers, mcOptions);
            };
            NgMap.getMap().then(function(map) {
                $scope.map = map;
                $scope.initMarkerClusterer();
            });
    }]);
}) (angular);