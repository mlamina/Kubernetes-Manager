'use strict';

angular.module('k8s-manager.dashboard')

  .controller('PodsResourceController', function($scope, pods, $stateParams, Pods) {
    $scope.pods = pods;
    function reloadData() {
      Pods.byNamespace($stateParams.namespace).then(function(pods) {
        $scope.pods = pods;
      });
    }
    $scope.$on('pods-changed', reloadData);
    $scope.$on('auto-reload', reloadData);
    $scope.podOrder = function(pod) {
      return new Date(pod.metadata.creationTimestamp);
    };
  })
  .controller('PodDetailController', function($rootScope, $scope, pod, Pods) {
    Pods.getPodLogs(pod.metadata.namespace, pod.metadata.name).then(function(log) {
      $scope.log = log;
    });

    $scope.pod = pod;
    $scope.delete = function () {
      Pods.deletePod(pod.metadata.namespace, pod.metadata.name).then(
        function(success) {
          $rootScope.$broadcast('pods-changed');
          $uibModalInstance.close();
        }, function(error) {
          alert(error.data);
        }
      );
    };
    $scope.containerStatuses = {};
    angular.forEach(pod.status.containerStatuses, function(status) {
      $scope.containerStatuses[status.name] = status;
    });

  })
  .directive('podStatus', function() {
    return {
      link: function(scope, element, attrs) {
        var phase = scope.pod.status.phase;
        element.text(phase);
        element.addClass('label');
        if (phase === 'Running') {
          if (scope.pod.containersReady === 0)
            element.addClass('label-danger')
          else if (scope.pod.containersReady < scope.pod.status.containerStatuses.length)
            element.addClass('label-warning');
          else
            element.addClass('label-success');
        } else if (phase === 'Waiting') element.addClass('label-info');
        else if (phase === 'Pending') element.addClass('label-info');
        else element.addClass('label-default');
      }
    };
  });