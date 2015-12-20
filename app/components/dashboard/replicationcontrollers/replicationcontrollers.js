'use strict';

angular.module('k8s-manager.dashboard')

  .controller('RcResourceController', function($scope, replicationControllers, ReplicationControllers, $stateParams) {
    $scope.rcs = replicationControllers;
    function reloadData() {
      ReplicationControllers.byNamespace($stateParams.namespace).then(function(rcs) {
        $scope.rcs = rcs;
      });
    }
    $scope.$on('pods-changed', reloadData);
    $scope.$on('auto-reload', reloadData);
  })
  .controller('RcDetailController', function($rootScope, $scope, replicationController, ReplicationControllers) {
    debugger;
    $scope.rc = replicationController;
    $scope.delete = function () {
      ReplicationControllers.deleteRc(replicationController.metadata.namespace, replicationController.metadata.name).then(
        function(success) {
          $rootScope.$broadcast('rcs-changed');
          $uibModalInstance.close();
        }, function(error) {
          alert(error.data);
        }
      );
    };
  });