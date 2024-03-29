/**
 * Created by frankiepo on 20/12/2016.
 */
(function(angular) {
    "use strict";
    const app = angular.module('FileClustering', ['ngMap', 'smart-table', 'ngMaterial']);
    app.factory('Items', ['$http', function($http) {
        const request = $http.get('photos.json');
        return {
            getItems: () => request.then(res => res.data.items),
            getTitles: () => request.then(res => res.data.titles)
        }
    }]);
    app.constant('MapCfg', {
        mcOptions: {
            imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'
        },
    });
    app.controller('MapController', ['NgMap', 'Items', 'MapCfg', '$scope', '$mdDialog',
        function(NgMap, Items, MapCfg, $scope, $mdDialog) {
            Items.getItems().then(items => $scope.items = items);
            // Items.getTitles().then(titles => $scope.titles = titles);
            NgMap.getMap().then(function(map) {
                $scope.markerClusterer = new MarkerClusterer(map, [], MapCfg.mcOptions);
                $scope.$watchGroup(['items', 'searchString'], function (newValues, oldValues, scope) {
                    if (!scope.items) return;
                    const withGeo = item => item.geo;
                    const withTag = item => (!scope.searchString) ? true : item.tags
                            .some(tag => tag.includes(scope.searchString));
                    const createMarker = item => {
                        const marker = new google.maps.Marker({
                            position: new google.maps.LatLng(item.geo[0], item.geo[1]),
                            title: item.file,
                            icon: item.thumbnail,
                        });
                        marker.addListener('click', () => $scope.showItem(item));
                        return marker;
                    };
                    scope.filteredItems = scope.items.filter(withTag);
                    scope.markers = scope.filteredItems
                        .filter(withGeo)
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
            $scope.tableRows = 5;
            $scope.setTableRows = (x) => $scope.tableRows = x;
            // $scope.closeDialog = () => $mdDialog.hide();
            $scope.showItem = (item) => {
                $mdDialog.show({
                    template:
                        `<img ng-src="images/saved_img/{{item.file}}" alt="picture">` +
                        `<md-chips ng-model="item.tags" name="tag" readonly="true" md-max-chips="10">` +
                        `      <md-chip-template>` +
                        `        <span>{{$chip}}</span>` +
                        `      </md-chip-template>` +
                        `    </md-chips>` +
                        `<md-button ng-click="closeDialog()">Close</md-button>`,
                    locals: {
                        item: item
                    },
                    controller: ($scope, $mdDialog, item) => {
                        $scope.item = item;
                        $scope.closeDialog = $mdDialog.hide;
                    }
                });
            };
        }]);

}) (angular);