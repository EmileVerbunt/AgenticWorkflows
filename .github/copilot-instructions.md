# Copilot Instructions

## Code review

- For ASP.NET Core API endpoints, verify that missing resources return `404 Not Found` rather than `200 OK` with a null body.
- Flag implementations that ignore route parameters or return successful responses for failed operations.
- Check that behavior changes include focused tests when the repository's existing test setup supports them.
