# Brandon Tsueda Portfolio

Source for [www.brandontsueda.com](https://www.brandontsueda.com), a static professional portfolio focused on network operations, cybersecurity, infrastructure, automation, business intelligence, and selected software projects.

## Structure

- `index.html` - professional profile, experience, skills, education, and contact links
- `projects.html` - selected projects and accessible detail dialogs
- `style.css` / `site.js` - shared presentation and interaction behavior
- `Brandon_Tsueda_Resume.pdf` - authoritative user-supplied resume, replaced September 13, 2026
- `generate_resume.py` - legacy resume generator; does not reproduce the current supplied PDF
- `scripts/validate_site.py` - local-link, metadata, and structural validation
- `DEPLOYMENT.md` - GitHub Pages deployment and rollback procedure

## Validate

```powershell
python scripts/validate_site.py
```

Only when explicitly replacing the supplied PDF with the legacy generated version:

```powershell
python generate_resume.py
```

## Security and privacy

The repository and published site are public. A recruiting phone number may appear in the downloadable resume, but it should not appear in the visible site interface. Do not add street addresses, credentials, private infrastructure addresses, tokens, or non-public operational details.
