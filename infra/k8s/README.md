## Prerequistic

Ingress-Nginx is required for this:

At the time of writing and building this, the following command was used.

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/cloud/deploy.yaml
```

But the docs keep changing, so it's best to following what is written here (for reference):
https://kubernetes.github.io/ingress-nginx/deploy/

## Info

All the service and deployment object configuration for the k8s clusters are inside this folder.

So simply using the following command on `kubectl` will deploy all the services:

```
kubectl apply -f .
```

or by using [Skaffold](www.skaffold.dev)
