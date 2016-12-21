/**
 * Created by frankiepo on 20/12/2016.
 */
(function(angular) {
    "use strict";
    var app = angular.module('FileClustering', ['ngMap', 'rzModule']);

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
                $scope.bounds.extend(marker.getPosition());
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
                $scope.bounds = new google.maps.LatLngBounds();
                $scope.initMarkerClusterer();
                $scope.map.setCenter($scope.bounds.getCenter());
                $scope.map.fitBounds($scope.bounds);
            });
            /* Slider initialization */
            var start = new Date(2011, 2, 5);
            var end   = new Date(2011, 5, 5);
            var dr    = moment.range(start, end);

            var dates = dr.toArray('days');

            $scope.slider = {
                from: 1,
                to: dates.length - 2,
                options: {
                    bindIndexForStepsArray: true,
                    stepsArray: dates,
                    translate: function(index, sliderId, label) {
                        var date = dates[index].format("DD.MM.YYYY");
                        switch (label) {
                            case 'floor':
                                return '<b>Min date:</b> ' + date;
                            case 'ceil':
                                return '<b>Max date:</b> ' + date;
                            case 'model':
                                return '<b>From date:</b> ' + date;
                            case 'high':
                                return '<b>To date:</b> ' + date;
                            default:
                                return date;
                        }
                    }
                }
            };
    }]);
}) (angular);