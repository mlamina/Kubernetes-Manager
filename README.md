DISCLAMER: This project is just a weekend project and does not claim to be well tested or production-ready
in any way.

# Kubernetes Manager

This project is a browser-based interface to the [http://kubernetes.io/](Kubernetes) API. The idea is
to provide most of the functionality of the `kubectl.sh` command-line tool. Additionally, it should give
you a quick overview of the health status of your Kubernetes cluster.


## Installation

Kubernetes Manager is meant to be run as a
[https://github.com/kubernetes/kubernetes/tree/master/cluster/addons](Cluster Addon).

### Prerequisites

You need a running Kubernetes cluster. See [http://kubernetes.io/](http://kubernetes.io/) for details.

### Copy the .yml files to your Kubernetes Master
 
TODO

### Start Service and Resource Controller

`cd` to the project root and execute `kubectl create -f k8s-manager`. After a few seconds, you should find the URL
to your Kubernetes Manager here:

`kubectl cluster-info`

## Development

Kubernetes Manager is built using [https://angularjs.org/](AngularJS). Please feel free to fork this repository,
ask me questions or submit pull requests!