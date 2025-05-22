# Deploy a nginx Ingress Controller with Argo CD

The declarative deployment manifest can be found in `argocd/nginx-ingress.yaml`.

The deployment configurations are part of the `argocd` namespace.

```bash {"cwd":"../argocd","name":"Deploy nginx Ingress Controller"}
kubectl apply -n argocd -f nginx-ingress.yaml
```
