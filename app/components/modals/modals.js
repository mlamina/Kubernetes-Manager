'use strict';

angular.module('k8s-manager.modals', ['ui.bootstrap', 'k8s-manager.api', 'ui.router'])
  .factory('Modals', ['Pods', 'ReplicationControllers', '$uibModal', function(Pods, ReplicationControllers, $uibModal) {
    return {
      openRcModal: function(namespace, rcName) {
        $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'components/modals/replication-controller.html',
          controller: 'RcModalController',
          resolve: {
            replicationController: function (ReplicationControllers) {
              return ReplicationControllers.getRc(namespace, rcName);
            }
          }
        });
      },
      openPodModal: function(namespace, podName) {
        $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'components/modals/pod.html',
          controller: 'PodModalController',
          resolve: {
            pod: function (Pods) {
              return Pods.getPod(namespace, podName);
            },
            log: function (Pods) {
              return Pods.getPodLogs(namespace, podName);
            }
          }
        });
      }
    }
  }]);