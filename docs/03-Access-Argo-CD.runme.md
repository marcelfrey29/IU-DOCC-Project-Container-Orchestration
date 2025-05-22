# Access Argo CD

Access Argo CD via Port-Forwarding.

```bash {"name":"Expose Argo CD via Port-Forwarding"}
# Use Port-Forwarding to make the API Server and UI accessible
kubectl port-forward svc/argocd-server -n argocd 9001:443
```

When Port-Forwarding is active, Argo CD can be accessed via

- Web UI: http://localhost:9001/
- Argo CD CLI (start with login: `argocd login localhost:9001`)
