'use strict';

angular.module('k8s-manager.dashboard')

  .controller('ServiceResourceController', function($scope, services, Services, $stateParams) {
    $scope.services = services;
    function reloadData() {
      Services.byNamespace($stateParams.namespace).then(function(services) {
        $scope.services = services;
      });
    }
    $scope.$on('pods-changed', reloadData);
    $scope.$on('auto-reload', reloadData);
  });