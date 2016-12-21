(function(angular, google) {
    "use strict";
    var app = angular.module('FileClustering', ['ngMap', 'rzModule']);

    app.controller('MapController', ['NgMap', '$scope', '$rootScope', '$http',
        function(NgMap, $scope, $rootScope, $http) {
            $scope.loadItems = function () {
                $http.get('htc_one_data.json').then(
                    function successCallback (res) {
                        $rootScope.items = res.data.items.filter(function(item) {
                            return item.geo;
                        });
                        filterItems();
                        $rootScope.titles = res.data.titles;
                    }, function errorCallback (res) {
                        console.error("Can't retrieve data set");
                        console.error(res);
                });
            };
            $scope.loadItems();
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
            var start = moment("2013-07-10 14:59:24+00:00"),
                end   = moment("2014-06-01 00:19:14+00:00"),
                dr    = moment.range(start, end);

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

            /* Filter */
            function filterItems() {
                $scope.filtered_items = $scope.items.filter(function(item) {
                    var itemMoment = moment(item.timestamp),
                        fromSliderMoment = moment(dates[$scope.slider.from]),
                        toSliderMoment = moment(dates[$scope.slider.to]);
                    return itemMoment >= fromSliderMoment && itemMoment <= toSliderMoment;
                });
            }
            function onSliderUpdate() {
                return $scope.items && filterItems();
            }
            $scope.$watch('slider.from', onSliderUpdate);
            $scope.$watch('slider.to', onSliderUpdate);
    }]);
}) (angular, google);