# Private GHCR Container Images

> [!NOTE]
> This is only required if the Container Images in GHCR are private.
>
> Images to reproduce the project are public and therefore this configuration is not necessary.

Kubernetes needs read-only permissions to access private Container Images stored in GHCR.
Therefore, an image-pull secret needs to be defined **in each application namespace**.
In addition, K8s manifests must specify the `imagePullSecrets` secret.
This secret must be manually configured because it can't be part of the source code.

GitHub:

- GitHub -> Account Settings -> Developer Settings -> Personal Access Tokens -> Tokens (classic)
- Generate a classic Token following the Principle of Least Privilege
   - Select `read:packages` as only scope

Local:

- Create a base64 string from `username` and `token`
   - `echo -n "GITHUB_USER_NAME:TOKEN" | base64`

- Create a Dockerconfig

```json
{
    "auths": {
        "ghcr.io": {
            "auth": "BASE_64_TOKEN"
        }
    }
}
```

- Create the K8s `Secret` value by creating the base64 string from the Dockerconfig
   - `echo -n  '{"auths":{"ghcr.io":{"auth":"BASE_64_TOKEN"}}}' | base64`

- Create the Kubernetes Secret Resource and apply it to **all** namespaces where the application is running

The Secret Template can be found in `argocd/helper/ghcr-pull-secret`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ghcr-pull-secret
data:
  .dockerconfigjson: BASE_64_DOCKER_CONFIG
type: kubernetes.io/dockerconfigjson
```

Apply the `Secret` to both `stage` and `prod` namespace:

```bash {"cwd":"../argocd/helper","name":"Apply Image Pull Secrets"}
kubectl apply -n stage-travel-guides -f ghcr-pull-secret.yaml
kubectl apply -n prod-travel-guides -f ghcr-pull-secret.yaml
```

Make sure the `imagePullSecrets` is added to all resources that want to download private images:

```yaml {"excludeFromRunAll":"false","interactive":"true"}
apiVersion: apps/v1
kind: Deployment
metadata:
spec:
  template:
    spec:
      containers:
      imagePullSecrets:
        - name: ghcr-pull-secret # <-- Name of K8s Secret
```
