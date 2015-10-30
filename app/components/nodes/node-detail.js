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

    // Configure CPU chart
    $scope.cpuChartData = [];
    var cpuCapacityPerSecond = details.num_cores * 1000000000; // cores * nanoseconds
    for (var i=1; i < containers.stats.length; i++) {
      var cpuUsage = containers.stats[i].cpu.usage.total - containers.stats[i-1].cpu.usage.total;
      $scope.cpuChartData.push({
        date: new Date(containers.stats[i].timestamp),
        usage: (cpuUsage / cpuCapacityPerSecond) * 100
      });
    }

    $scope.cpuChartOptions = {
      axes: {
        x: {key: 'date', type: 'date', thickness: '2px', ticks: 2},
        y: {type: 'linear', min: 0, max: 100, ticks: 5, innerTicks: true, grid: true}
      },
      margin: {
        left: 30,
        right: 10,
        bottom: 30
      },
      series: [
        {y: 'usage', color: 'steelblue', thickness: '2px', type: 'area', striped: false, label: 'CPU Utilization', drawDots: false}
      ],
      lineMode: 'linear',
      tension: 0.7,
      //tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return 'pouet';}},
      drawLegend: false,
      drawDots: false,
      hideOverflow: false,
      columnsHGap: 5
    }
  }]);