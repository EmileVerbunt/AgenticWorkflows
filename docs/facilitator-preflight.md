# Facilitator preflight

Complete these checks before distributing the template link.

## GitHub organization

- Participants can create repositories from organization templates.
- Participants have GitHub Copilot and Codespaces access.
- GitHub Actions permits `copilot-requests: write`.
- Actions workflows can create issues, branches, and pull requests.
- **Allow GitHub Actions to create and approve pull requests** is enabled for participant repositories or inherited from organization policy.

## Template repository

- Mark this repository as a template in **Settings > General > Template repository**.
- Keep the default branch named `main`.
- Keep Issues and Actions enabled.
- Run `gh aw compile --validate --purge` and commit generated files.
- Confirm the default branch is green before the workshop.

## Dry run

1. Create a disposable repository from the template in the workshop organization.
2. Confirm **Seed Workshop** creates five issues, the labels, and one sample pull request.
3. Run **Seed Workshop** again and confirm no duplicates are created.
4. Open a Codespace and confirm post-create validation succeeds.
5. Run one existing demonstration with no repository secret configured.
6. Complete one beginner assignment and one advanced assignment.
7. Delete the disposable repository.

## Recovery

- Missing issues or sample PR: rerun **Seed Workshop**.
- Failed sample PR creation: check the organization's Actions pull-request policy.
- Copilot authentication failure: verify the participant has an eligible Copilot seat and the workflow grants `copilot-requests: write`.
- Codespace bootstrap failure: rebuild the container and inspect `.devcontainer/postCreate.sh`.
