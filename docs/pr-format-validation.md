# PR Body Format Validation

This document describes the expected PR body format for maintainers and the verification step generation process.

## PR Body Structure

All pull requests should follow this structure:

```
## Summary

Brief description of what this PR does and why.

## Changes

- List of specific changes made
- Each item should be concise and actionable

## Testing

- Steps taken to verify the changes work correctly
- Any automated tests added or updated

## Related Issues

Closes #<issue-number> (if applicable)

## Checklist

- [ ] Code follows the project style conventions
- [ ] Self-review completed
- [ ] Documentation updated if needed
- [ ] Tests added/updated if applicable
```

## Verification Steps

Maintainers should verify the following when reviewing a PR:

1. **Format compliance** — PR body matches the structure above
2. **Summary clarity** — The summary clearly explains the change and motivation
3. **Change completeness** — All relevant files are included in the diff
4. **Test coverage** — New logic is covered by tests or manually verified
5. **Documentation** — README or inline docs updated where appropriate

## Smoke Test Procedure

To validate PR body formatting tooling:

1. Open a draft PR with a body matching the template above
2. Confirm the CI/linting pipeline parses sections correctly
3. Confirm verification steps are generated from the checklist items
4. Close the draft PR once validation is confirmed

## Notes for Maintainers

- PRs missing a `## Summary` section should be returned to the author
- PRs with empty checklists should not be merged
- Smoke-test PRs (like this one) are safe to close without merging
