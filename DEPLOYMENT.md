# Deployment

## Production

- Repository: `https://github.com/BrandonTsueda/PortfolioPage`
- Branch: `main`
- Hosting: GitHub Pages, repository root
- Domain: `https://www.brandontsueda.com/`
- DNS/custom domain source: `CNAME`

## Release procedure

1. Confirm the working tree is clean except for the intended change.
2. Run `python generate_resume.py` if resume content changed.
3. Run `python scripts/validate_site.py`.
4. Review the diff, commit, and push `main`.
5. Wait for GitHub Pages to report `built`.
6. Confirm the public root, projects page, resume, `robots.txt`, and `sitemap.xml` return HTTP 200 over HTTPS.
7. Confirm the public HTML contains the new commit's expected content.

## Rollback

Revert the faulty commit with `git revert <commit>`, push the resulting commit to `main`, and repeat the public verification steps. Do not rewrite the shared branch history.
