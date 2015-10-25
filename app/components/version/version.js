'use strict';

angular.module('k8s-manager.version', [
  'k8s-manager.version.interpolate-filter',
  'k8s-manager.version.version-directive'
])

.value('version', '0.1');
