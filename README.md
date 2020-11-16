## Bhuwan Garbuja

## Intro

This is a second part after learnings from [previous experimentation](https://github.com/bhuone-garbu/ms-blog) to build microservice and cover more concepts.

## Tech Stack:

An attempt to build a proper (Full Stack) ticket booking system with microservices. The front-end (FE) is less of a focus on this project.

* NodeJS/Express (TypeScript based)
* React/Next.js (JavaScript based)
* Docker
* Kubernetes (k8s) / Ingress Nginx
* Skaffold
* MongoDB
* NATS Streaming Server
* Stripe for payments

Some concepts I've covered (or will cover) for reference:

* Communicating services within a k8s cluster
* Server side rendering with Next.js
* Authentication strategies
* Designing micro-services with k8s object configs
* Use of NATS Streaming Server
* Handling concurrency with async events
* (OCC) Optimistic concurrency control idea with Mongoose/MongoDB
* Bull (library with Redis queue) for delayed tasks processing
* Using Github Actions

## Getting started

### TODO

Install `kubectl` either via Docker for Mac/Windows or via minikube.

Reminder: The following secrets are needed to be shared and accessible to the cluster:

* `jwt-secret` - JWT_KEY
* `stripe-secret` - STRIPE_KEY

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=somescret
kubectl create secret generic strip-secret --from-literal=STRIPE_KEY=strip-secret-key
```

All the deployments of object configuration for k8s are inside the `infra/k8s` director. Check the README over there too to view more inital requirements.

### Dev environment

The following stack are assumed installed in the machine and working:

* Docker/Kubernetes
* [Skaffold](www.skaffold.dev)

Currently the projects uses `ticketing.dev` for the main root url. Set your `hosts` file to point this domain to localhost (or 127.0.0.1).

Then run command on the root of this project to deploy all the services.

```
skaffold dev
```

### Prod deployment

Using digital ocean

```
doctl auth login
```

To create cluster context for `kubectl`
```
doctl kubernetes cluster kubeconfig save <cluster_name>
```

In case, new to view contexts (or switch context):

```
kubectl config view
kubectl config use-context <context_name>
```
