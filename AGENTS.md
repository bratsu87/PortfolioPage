# Portfolio operating instructions

- GitHub `BrandonTsueda/PortfolioPage` on branch `main` is the source of truth.
- Production is GitHub Pages at `https://www.brandontsueda.com/`.
- Preserve the static HTML/CSS/JavaScript architecture unless a migration is explicitly approved.
- Keep claims factual and suitable for public disclosure. Never publish secrets, private IP addresses, credentials, customer data, or internal employer details. The recruiting phone number belongs only in the downloadable resume, not the visible site interface.
- Update `generate_resume.py` and regenerate `Brandon_Tsueda_Resume.pdf` when resume content changes.
- Run `python scripts/validate_site.py` before committing.
- After pushing `main`, verify the Pages build, HTTPS redirect, primary pages, resume, robots file, sitemap, and deployed commit.
