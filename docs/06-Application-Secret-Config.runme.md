# Application Secrets

The backend service needs a secret in order to access the DynamoDB Local database.
This secret must be manually configured because it can't be part of the source code.

The Secret Template can be found in `argocd/helper/dynamodb-secret.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dynamodb-secret
stringData:
  access-key: XXX # TODO: Replace with actual value (`XXX` is ok for DynamoDB Local)
  secret-key: XXX # TODO: Replace with actual value (`XXX` is ok for DynamoDB Local)
type: kubernetes.io/opaque

```

> [!NOTE]
> The application is configured to always use DynamoDB Local.
> This means that no valid AWS Credentials are required, however empty credentials are not allowed.
> Therefore, use any value for access key and secret key.

Apply the `Secret` to both `stage` and `prod` namespace:

```bash {"cwd":"../argocd/helper","name":"Apply DynamoDB Secret"}
kubectl apply -n stage-travel-guides -f dynamodb-secret.yaml
kubectl apply -n prod-travel-guides -f dynamodb-secret.yaml
```