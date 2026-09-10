# Brandon Tsueda Portfolio

Source for [www.brandontsueda.com](https://www.brandontsueda.com), a static professional portfolio focused on network operations, cybersecurity, infrastructure, automation, business intelligence, and selected software projects.

## Structure

- `index.html` - professional profile, experience, skills, education, and contact links
- `projects.html` - selected projects and accessible detail dialogs
- `style.css` / `site.js` - shared presentation and interaction behavior
- `generate_resume.py` - reproducible public resume generator
- `scripts/validate_site.py` - local-link, metadata, and structural validation
- `DEPLOYMENT.md` - GitHub Pages deployment and rollback procedure

## Validate

```powershell
python scripts/validate_site.py
```

Regenerate the resume after changing its source:

```powershell
python generate_resume.py
```

## Security and privacy

The repository and published site are public. A recruiting phone number may appear in the downloadable resume, but it should not appear in the visible site interface. Do not add street addresses, credentials, private infrastructure addresses, tokens, or non-public operational details.
