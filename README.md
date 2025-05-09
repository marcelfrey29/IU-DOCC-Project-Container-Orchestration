# IU-DOCC-Project-Container-Orchestration

## Documentation

- [Project Preparation](docs/01-Preparation.md)

## CI/CD Architecture

**Continuous Integration and Delivery with GitHub Actions**:

- Verify backend, frontend, and K8s definitions
- Build and package the backend and frontend into a container image and push it to GitHub Container Registry (GHCR)
- Run security checks 
- Update the K8s manifests with the image versions and push the changes back to the GitHub Repository
- Move the environment tags forward

![CI/CD with GitHub Actions](docs/assets/ci-overview-github-actions.svg)
