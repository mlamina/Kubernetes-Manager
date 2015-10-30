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
    // Calculate file system usages
    var usages = {};
    angular.forEach(containers.stats[containers.stats.length-1].filesystem, function(fs) {
      var percentage = fs.capacity / fs.usage;
      var type = 'success';
      if (percentage < 25) {
        type = 'success';
      } else if (value < 50) {
        type = 'info';
      } else if (value < 75) {
        type = 'warning';
      } else {
        type = 'danger';
      }
      fs.percentage = percentage;
      fs.type = type;
      usages[fs.device] = fs;
    });
    $scope.fsStats = usages;
  }]);