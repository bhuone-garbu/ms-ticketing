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

## Getting started

Install `kubectl` either via using Docker or via minikube.

A `JWT_KEY` secret is needs to be shared and accessible to service.
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=yoursecret
```


