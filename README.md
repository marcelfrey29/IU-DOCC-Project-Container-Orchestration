# IU-DOCC-Project-Container-Orchestration

**Continuous Deployment of a Three-Tier Web-Application to Kubernetes using GitHub Actions, Argo CD, and Kustomize**

[![Backend CI (Golang)](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/backend-ci.yml)
[![Web App CI (TypeScript/React)](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/web-app-ci.yml/badge.svg)](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/web-app-ci.yml)
[![Kubernetes CI](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/k8s-ci.yml/badge.svg)](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/k8s-ci.yml)

[![Continuous Delivery](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/cd.yml/badge.svg)](https://github.com/marcelfrey29/IU-DOCC-Project-Container-Orchestration/actions/workflows/cd.yml)

- [x] **Continuous Integration and Delivery (CI/CD)** with **GitHub Actions** using **GitHub Container Registry (GHCR)**
- [x] **Continuous Deployment (CD)** to **Kubernetes** with **Argo CD**
- [x] **Multi-Environment Support** (`stage`-> `prod`) via **Kustomize**
- [x] **Security** is ensured by **Trivy** and **Bearer** which are part of the Pipeline and acts as quality gate
- [x] Polyglot three-tier Web Application running in **Kubernetes**
    - [x] **Horizontal Pod Autoscaling** with **HPA** für the Frontend (TypeScript/React) and Backend (Golang)
    - [x] **DynamoDB Local** database deployment as `StatefulSet`
    - [x] Access through an **nginx Ingress Controller**

## Documentation

- [Project Preparation](docs/01-Preparation.md)
- [Argo CD Installation](docs/02-Setup-Argo-CD.runme.md)
- [Access to Argo CD](docs/03-Access-Argo-CD.runme.md)

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

**Multi-Environment support with Kustomize**:

- Prevent duplicated manifests
- Replace certain values
- Add a prefix to any resource

![Kustomize Patch](docs/assets/kustomize-patch.svg)

## Web-App Architecture

**Application components and Kubernetes resources**:

![Application Architecture in Kubernetes](docs/assets/k8s-application-architecture.svg)

## Results

**GitHub Actions: Continuous Delivery Workflow**

![GitHub Actions Continuous Delivery Workflow](docs/assets/github-actions-cicd.png)

**GitHub Actions: Backend Continuous Integration Steps**

![GitHub Actions Backend Steps](docs/assets/github-actions-cicd-backend-ci.png)

**Argo CD: Overview**:

![Argo CD Overview](docs/assets/argocd-overview.png)

**Argo CD: Travel Guides `prod` Application**:

![Argo CD](docs/assets/argocd-prod.png)

**Argo CD and the running `stage` and `prod` applications**:

![Argo CD and Applications](docs/assets/argocd-with-apps.png)

**Kubernetes Namespaces and Pods in `stage` and `prod` Namespace**:

![K8s Namespaces and Pods](docs/assets/k8s-namespaces-and-pods.png)
