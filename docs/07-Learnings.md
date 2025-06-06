# Learnings & Challenges

- Debugging of CI/CD steps is time-consuming, especially of the once that come late in the process (long feedback times)
    - Isolated testing is not always possible, for example if steps depend on previous ones
- Private Repository and Packages represent an enterprise-like setup, but add additional complexity
    - There's a lot _at once_ (at the beginning / when getting started with new tools) and a lot of possible things that can be wrong which increases time until a problem is found
    - Secrets in Argo CD (repo access) and pull-secrets in **each** application namespace
- The single repository approach definetely has downsides I didn't see in the beginning
    - The CD workflow doesn't run automatically if there are only changes to the K8s resources
        - Can't be added to condition because with the push-back of the image updates we would have an infinite-loop
        - A second piepline could be used as workaround (shared steps can be used)
- Run Kustomize generation in the CI
    - In our setup, the final manifests are generated by Argo CD _within the cluster_ (once changes are detected and pulled)
    - Invalid Kustomize files/configuration was detected while Argo CD tried to apply the changes (which is very late in the process, actually in the very last step of the entire process)
    - The manifest can also be generated by `kubectl` (e.g. `kubectl kustomize kubernetes/overlays/stage`) which fails if something is not valid
    - These checks have been added to the K8s CI, so issues are detected in PRs already (very early, successfull shift left)
- Improved K8s/Container Security skills thanks to Kube-Linter and Trivy issues and recommendations, but that was time-consuming
- Written all K8s manifest myself to get get more hand-on experience and strenghten by K8s skills
    - Worked generally well, but small issues were time-consuming (e.g. wrong selector statements, `app` vs. `name`)
    - Finding out why the `Ingress` objects didn't work was hard... But then I deployed a controller for that (nginx Ingress Controller)...
    - Switching to the Helm-Chart of the nginx Ingress Controller wasn't smooth because the name of the `ingressClassName` changed (It took hours to find that...)
    - Debugging K8s Networking is challenging in the beginning until I found my way out doing it effectively 
        - Start from the Pod and move backwards: One time the network wasn't the cause for the _unreachable_ pod, instead the Pod was is a crashloop...
        - Using temporary Port-forwarding is helpful to test if a container is working as expected
- There are noo many Git tags...
