#!/usr/bin/env python3
"""Validate the static portfolio without external dependencies."""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted([*ROOT.glob("*.html"), *(ROOT / "lab").glob("*.html")])
REQUIRED_FILES = (
    "index.html",
    "projects.html",
    "style.css",
    "site.js",
    "robots.txt",
    "sitemap.xml",
    "favicon.svg",
    "Brandon_Tsueda_Resume.pdf",
)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[str] = []
        self.has_title = False
        self.has_description = False
        self.has_viewport = False
        self.has_canonical = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag in {"a", "link", "script", "img"}:
            target = values.get("href") or values.get("src")
            if target:
                self.links.append(target)
        if tag == "title":
            self.has_title = True
        if tag == "meta" and values.get("name") == "description" and values.get("content"):
            self.has_description = True
        if tag == "meta" and values.get("name") == "viewport":
            self.has_viewport = True
        if tag == "link" and values.get("rel") == "canonical" and values.get("href"):
            self.has_canonical = True


def local_target(source: Path, value: str) -> Path | None:
    parsed = urlparse(value)
    if parsed.scheme or value.startswith(("#", "//", "mailto:", "tel:")):
        return None
    path = parsed.path
    if not path:
        return None
    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path
    return target.resolve()


def validate() -> list[str]:
    errors: list[str] = []
    for name in REQUIRED_FILES:
        if not (ROOT / name).is_file():
            errors.append(f"missing required file: {name}")

    for page in HTML_FILES:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        duplicate_ids = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
        if duplicate_ids:
            errors.append(f"{page.name}: duplicate ids: {', '.join(duplicate_ids)}")
        for label, present in (
            ("title", parser.has_title),
            ("meta description", parser.has_description),
            ("viewport", parser.has_viewport),
            ("canonical URL", parser.has_canonical),
        ):
            if not present:
                errors.append(f"{page.name}: missing {label}")
        for value in parser.links:
            target = local_target(page, value)
            if target is not None and not target.exists():
                errors.append(f"{page.name}: broken local reference: {value}")

    try:
        ET.parse(ROOT / "sitemap.xml")
        ET.parse(ROOT / "favicon.svg")
    except (ET.ParseError, OSError) as exc:
        errors.append(f"XML validation failed: {exc}")

    return errors


if __name__ == "__main__":
    failures = validate()
    if failures:
        print("Portfolio validation failed:")
        for failure in failures:
            print(f"- {failure}")
        sys.exit(1)
    print(f"Portfolio validation passed for {len(HTML_FILES)} HTML pages.")
