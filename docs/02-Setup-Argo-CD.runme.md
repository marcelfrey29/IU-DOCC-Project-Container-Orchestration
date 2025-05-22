# Setup Argo CD in Kubernetes

Setup Argo CD in the Kubernetes Cluster based on the official [documentation](https://argo-cd.readthedocs.io/en/stable/getting_started/#creating-apps-via-ui).

## Prerequisites

- A Kubernetes Cluster
- Argo CD CLI installed ([Docs](https://argo-cd.readthedocs.io/en/stable/getting_started/#2-download-argo-cd-cli))

## Installation and initial Setup of Argo CD

These steps need to be performed once.

```bash {"name":"Install Argo CD"}
# Create a new Namespace for Argo CD
kubectl create namespace argocd

# Install Argo CD in the K8s Cluster
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Expose Argo CD to that it can be accessed via CLI or Web UI.

```bash {"name":"Expose Argo CD via Port-Forwarding"}
# Use Port-Forwarding to make the API Server and UI accessible
# We don't use the default Port 8080 because this port will be used by other applications.
kubectl port-forward svc/argocd-server -n argocd 9001:443
```

Get the default password and change it (default username is `admin`).

```bash {"name":"Initial Setup (Change default password)"}
# Get the first-time password
# The default username is "admin"
argocd admin initial-password -n argocd

# Login to Argo CD via CLI
# Trust the self-signed certificate with "y" if required.
# Use "admin" as username and the password from the previous command
argocd login localhost:9001

# Change the default password (follow the instructions to set a new one)
argocd account update-password
```
