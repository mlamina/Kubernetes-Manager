'use strict';

angular.module('k8s-manager.modals')
  .controller('PodModalController', ['$rootScope', '$scope', 'pod', 'log', '$uibModalInstance', 'Pods',
    function($rootScope, $scope, pod, log, $uibModalInstance, Pods) {
    $scope.log = log;
    $scope.pod = pod;
    $scope.close = function () {
      $uibModalInstance.close();
    };
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

  }]);