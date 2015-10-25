'use strict';

angular.module('k8s-manager.events', ['ui.bootstrap', 'k8s-manager.api', 'k8s-manager.modals'])

.controller('EventsCtrl', ['$scope', 'events', 'Modals',
  function($scope, events, Modals) {
    $scope.events = events;
    $scope.openPodModal = Modals.openPodModal;
  }]);