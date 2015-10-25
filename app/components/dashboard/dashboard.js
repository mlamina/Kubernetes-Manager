'use strict';

angular.module('k8s-manager.overview', ['ui.bootstrap', 'k8s-manager.api', 'k8s-manager.modals', 'ui.router'])

  .controller('ServiceResourceController', ['$scope','namespaceServices',
    function($scope, namespaceServices) {
      $scope.services = namespaceServices;
    }])

  .controller('RcResourceController', ['$scope','namespaceReplicationControllers', 'ReplicationControllers',
    function($scope, namespaceReplicationControllers, ReplicationControllers) {
      $scope.rcs = namespaceReplicationControllers;
      $scope.$on('pods-changed', function(event, args) {
        ReplicationControllers.byNamespace($stateParams.namespace).then(function(rcs) {
          $scope.rcs = rcs;
        });
      });
    }])

  .controller('PodsResourceController', ['$scope', '$uibModal', 'namespacePods', 'Modals', '$stateParams', 'Pods',
    function($scope, $uibModal, namespacePods, Modals, $stateParams, Pods) {
      $scope.pods = namespacePods;
      $scope.openModal = function(pod) {
        Modals.openPodModal($stateParams.namespace, pod.metadata.name);
      };
      $scope.$on('pods-changed', function(event, args) {
        Pods.byNamespace($stateParams.namespace).then(function(pods) {
          $scope.pods = pods;
        });
      });
  }])

  .controller('DashboardMenuCtrl', ['$scope', '$stateParams', 'namespaces', 'quotas',
    function($scope, $stateParams, namespaces, quotas) {
      $scope.current_namespace = $stateParams.namespace;
      $scope.namespaces = namespaces;
      $scope.quotas = quotas;
    }])
  .directive('podStatus', function() {
    return {
      link: function(scope, element, attrs) {
        var phase = scope.pod.status.phase;
        element.text(phase);
        element.addClass('label');
        if (phase === 'Running') element.addClass('label-success');
        else if (phase === 'Waiting') element.addClass('label-info');
        else if (phase === 'Pending') element.addClass('label-info');
        else element.addClass('label-default');
      }
    };
  });