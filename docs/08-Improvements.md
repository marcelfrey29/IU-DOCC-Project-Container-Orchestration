# Improvements

- Improve the way how secrets are added (currently, manual work is required)
- Support independent deployment of web app, backend, and infrastructure changes (currently everything is deployed as once)
- Decouple deployments from releases, e.g. by adding Feature Flags
- Integrate observability tools: Show deployments as vertical lines in graphs to immediately see if the change to a metrics relates corelates with a deployment
- Resolve partial redundancy in tools: E.g. Kube-Linter and Trivy both report same issues 
