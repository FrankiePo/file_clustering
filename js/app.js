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
                    $rootScope.items = res.data.items;
                    $rootScope.titles = res.data.titles;
                });
            };
            $scope.load_items();
    }]);
}) (angular);