# Portfolio operating instructions

- GitHub `BrandonTsueda/PortfolioPage` on branch `main` is the source of truth.
- Production is GitHub Pages at `https://www.brandontsueda.com/`.
- Preserve the static HTML/CSS/JavaScript architecture unless a migration is explicitly approved.
- Keep claims factual and suitable for public disclosure. Never publish secrets, private IP addresses, credentials, customer data, or internal employer details. The recruiting phone number belongs only in the downloadable resume, not the visible site interface.
- `Brandon_Tsueda_Resume.pdf` is the user-supplied resume (replaced September 13, 2026). Preserve it exactly; run the legacy `generate_resume.py` only when explicitly asked to replace it with a generated resume.
- Run `python scripts/validate_site.py` before committing.
- After pushing `main`, verify the Pages build, HTTPS redirect, primary pages, resume, robots file, sitemap, and deployed commit.
