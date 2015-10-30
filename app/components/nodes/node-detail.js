'use strict';

angular.module('k8s-manager.nodes')

.controller('NodeDetailCtrl', ['$scope', '$stateParams', 'Nodes', 'details', 'containers',
  function($scope, $stateParams, Nodes, details, containers) {
    $scope.nodeName = $stateParams.name;
    $scope.details = details;
    $scope.containers = containers;
    function reloadData() {
      Nodes.getDetails($stateParams.name).then(function(details) {
        $scope.details = details;
      });
      Nodes.getContainers($stateParams.name).then(function(containers) {
        $scope.containers = containers;
      });
    }
    $scope.$on('auto-reload', reloadData);
  }]);