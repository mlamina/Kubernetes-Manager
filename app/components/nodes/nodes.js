'use strict';

angular.module('k8s-manager.nodes')

.controller('NodesCtrl', ['$scope', 'nodes', 'Nodes',
  function($scope, nodes, Nodes) {
    $scope.nodes = nodes;
    function reloadData() {
      Nodes.queryAll().then(function(nodes) {
        $scope.nodes = nodes;
      });
    }
    $scope.$on('auto-reload', reloadData);
  }]);