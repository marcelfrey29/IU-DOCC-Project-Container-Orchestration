# Argo CD Configuration

## Declarative Deployment Configuration 

Argo CD can be configured using a declarative setup.
All configuration manifests are located in the `argocd/` directory and can be applied using `kubectl`.

The deployment configurations are part of the `argocd` namespace.

```bash {"cwd":"../argocd","name":"Apply Argo CD Configuration"}
# In the UI it looks like the default project exists, but applying resources fails.
# Declaring the default project explicitly solves this issues.
# For this reason, the default project is created first.
kubectl apply -n argocd -f default-project.yaml

# Define the repository that Argo CD should observe. 
kubectl apply -n argocd -f repository.yaml

# Define the stage and prod application. 
# Both use the same repository, but define a different targetRevision.
kubectl apply -n argocd -f travel-guides-stage.yaml
kubectl apply -n argocd -f travel-guides-prod.yaml
```

## Private GitHub Repository

In case the GitHub Repository is private, Argo CD needs read-only access to the repository.

Create a fine-grained access token in GitHub, following the Principal of Least Privilege:
- GitHub -> Account Settings -> Developer Settings -> Personal Access Tokens -> Fine-grained Tokens
- Limit the repository access to the required repository and only select the following **repository** permissions:
    - Content: Read-only
    - Metadata: Read-only (Required by GitHub, pre-selected)
    - Webhooks: Read-only

Setup the Token in Argo CD (Web UI):
- ArgoCD -> Settings -> Repositories -> _Name of Repository to Access_
- Use the GitHub Access Token as `password` and leave the `username` empty
    - In case an empty username is not allowed, provide a random value

Once the changes are saved, Argo CD should no be able to read the repository and start to deploy the application.
