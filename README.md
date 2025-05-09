# IU-DOCC-Project-Container-Orchestration

## Documentation

- [Project Preparation](docs/01-Preparation.md)

## CI/CD Architecture

**Pull-based Continuous Deployment**:

- Everything is pulled and observed from inside the cluster
- Increased security because no external access to the cluster is required
    - With a push-based approach, the cluster must be reachable from the outside and the CI/CD system needs high-privilege credentials

![Pull-based CD](docs/assets/pull-based-cd.svg)

**Continuous Integration and Delivery with GitHub Actions**:

- Verify backend, frontend, and K8s definitions
- Build and package the backend and frontend into a container image and push it to GitHub Container Registry (GHCR)
- Run security checks 
- Update the K8s manifests with the image versions and push the changes back to the GitHub Repository
- Move the environment tags forward

![CI/CD with GitHub Actions](docs/assets/ci-overview-github-actions.svg)

**Continuous Deployment with Argo CD**:

- Argo CD observes the environment tag and maintains the desired state in the K8s cluster
- Each environment has its own namespace
- The images defined in the target-revision are pulled from GitHub Container Registry (GHCR)

![CD with Argo CD](docs/assets/cd-overview-argocd.svg)

## Web-App Architecture

**Application components and Kubernetes resources**:

![Application Architecture in Kubernetes](docs/assets/k8s-application-architecture.svg)
