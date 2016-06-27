'use strict';

angular.module('k8s-manager.nodes')

  .controller('NodeDetailCtrl', ['$scope', '$stateParams', '$filter', 'Nodes', 'details', 'containers',
    function($scope, $stateParams, $filter, Nodes, details, containers) {
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
        } else if (percentage < 50) {
          type = 'info';
        } else if (percentage < 75) {
          type = 'warning';
        } else {
          type = 'danger';
        }
        fs.percentage = percentage;
        fs.type = type;
        usages[fs.device] = fs;
      });
      $scope.fsStats = usages;

      $scope.$watch('containers', function(newValue, oldValue) {
        configureCpuChart();
        configureMemoryChart();
      });

      //$scope.xAxisTickFormat = function(d) {
      //  return d3.time.format('%b %d')(new Date(d));
      //};

      function configureCpuChart() {
        // Configure CPU chart
        var cpuChartData = [];
        var cpuCapacityPerSecond = $scope.details.num_cores * 1000000000; // cores * nanoseconds
        for (var i = 1; i < $scope.containers.stats.length; i++) {
          var cpuUsage = $scope.containers.stats[i].cpu.usage.total - $scope.containers.stats[i - 1].cpu.usage.total;
          var currentUsage = (cpuUsage / cpuCapacityPerSecond) * 100;
          cpuChartData.push([new Date($scope.containers.stats[i].timestamp), currentUsage]);
        }
        $scope.cpuChartData = [{ key: "CPU", values: cpuChartData }];
      }

      function configureMemoryChart() {
        var usage = $scope.containers.stats[$scope.containers.stats.length-1].memory.usage;
        var capacity = $scope.details.memory_capacity;
        $scope.memoryChartData = [
          { label: "Free", value: capacity - usage, color: '#66CC00'},
          { label: "Used", value: usage, color: '#CC3300'}
        ];
        nv.addGraph(function() {
          var chart = nv.models.pieChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .showLegend(false)
            .margin({
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            })
            .donut(true)
            .donutRatio(0.45)
            .labelType("percent")
            .showLabels(false);
          chart.title(Math.round(usage / capacity * 100) + "%");
          d3.select("#memoryChart svg")
            .datum($scope.memoryChartData)
            .transition().duration(1500)
            .call(chart);
          return chart;
        });

      }
      configureMemoryChart();
      configureCpuChart();
    }]);