'use strict';

angular.module('k8s-manager.modals', ['ui.bootstrap', 'k8s-manager.api', 'ui.router'])
  .factory('Modals', ['Pods', '$uibModal', function(Pods, $uibModal) {
    return {
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