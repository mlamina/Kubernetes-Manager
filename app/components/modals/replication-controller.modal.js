'use strict';

angular.module('k8s-manager.modals')
  .controller('RcModalController', ['$rootScope', '$scope', 'replicationController', '$uibModalInstance', 'ReplicationControllers',
    function($rootScope, $scope, replicationController, $uibModalInstance, ReplicationControllers) {
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
      $scope.close = function () {
        $uibModalInstance.close();
      };
    }]);