#!/usr/bin/env python3
"""Extract per-page content (title, meta description, headings, body text)
from the live hyvantuulensauna.fi site into one Markdown file."""

import html.parser
import re
import urllib.request

BASE = "https://www.hyvantuulensauna.fi"

PAGES = [
    ("Etusivu / Homepage", "/", "/en/"),
    ("Saunalauttaristeilyt / Sauna Boat Cruises", "/saunalauttaristeilyt-helsingissa/", "/en/sauna-boat-cruises-helsinki/"),
    ("Julkinen sauna / Public Sauna", "/julkinen-sauna/", "/en/public-sauna-helsinki/"),
    ("Avanto ja saunatila / Ice Swimming", "/avanto/", "/en/ice-swimming-sauna-helsinki/"),
    ("Yksityissauna / Private Sauna & Events", "/yksityissauna/", "/en/private-sauna-helsinki/"),
    ("Sijainti / Location", "/sijainti/", "/en/location/"),
    ("Toiminnastamme / About", "/toiminnastamme/", "/en/about/"),
    ("Usein kysyttyä / FAQ", "/usein-kysyttya/", "/en/faq/"),
    ("Galleria / Gallery", "/galleria/", "/en/gallery/"),
]

# Elements whose whole subtree is ignored (nav, footer, chrome, embeds)
SKIP_TAGS = {"script", "style", "noscript", "svg", "header", "footer", "nav", "button", "select", "option", "iframe"}
# Text-bearing elements we collect
TEXT_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "summary", "blockquote", "figcaption"}
# HTML void elements — never have a closing tag
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class PageExtractor(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.meta_description = ""
        self.items = []  # list of (tag, text)
        self._skip_stack = []   # subtree-roots currently being skipped
        self._buf = None        # list while inside a TEXT_TAG
        self._buf_tag = None
        self._buf_depth = 0     # open tags inside the current buffer
        self._in_title = False

    # -- helpers ---------------------------------------------------------
    def _skipping(self):
        return bool(self._skip_stack)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("name") == "description":
            self.meta_description = attrs.get("content", "")
            return
        if self._skipping():
            if tag not in VOID_TAGS:
                self._skip_stack.append(tag)
            return
        if tag in SKIP_TAGS:
            if tag not in VOID_TAGS:
                self._skip_stack.append(tag)
            return
        if tag == "title":
            self._in_title = True
            return
        if self._buf is not None:
            if tag not in VOID_TAGS:
                self._buf_depth += 1
            return
        if tag in TEXT_TAGS:
            self._buf = []
            self._buf_tag = tag
            self._buf_depth = 0

    def handle_startendtag(self, tag, attrs):
        # self-closing XML-style tags: treat like start+end
        if tag == "meta":
            attrs = dict(attrs)
            if attrs.get("name") == "description":
                self.meta_description = attrs.get("content", "")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
            return
        if self._skipping():
            if self._skip_stack and self._skip_stack[-1] == tag:
                self._skip_stack.pop()
            elif tag in self._skip_stack:
                # tolerate minor mis-nesting
                while self._skip_stack and self._skip_stack[-1] != tag:
                    self._skip_stack.pop()
                if self._skip_stack:
                    self._skip_stack.pop()
            return
        if self._buf is not None:
            if tag == self._buf_tag and self._buf_depth == 0:
                text = re.sub(r"\s+", " ", "".join(self._buf)).strip()
                if text:
                    self.items.append((self._buf_tag, text))
                self._buf = None
                self._buf_tag = None
            elif self._buf_depth > 0:
                self._buf_depth -= 1

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._buf is not None:
            self._buf.append(data)


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (content-export)"})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read().decode("utf-8", errors="replace")


def dedupe_consecutive(items):
    out, prev = [], None
    for item in items:
        if item != prev:
            out.append(item)
        prev = item
    return out


def render_page(url):
    html_text = fetch(url)
    ex = PageExtractor()
    ex.feed(html_text)

    lines = []
    lines.append(f"**URL:** {url}")
    lines.append("")
    lines.append(f"**Title tag:** {ex.title.strip()}")
    lines.append("")
    lines.append(f"**Meta description:** {ex.meta_description.strip()}")
    lines.append("")
    lines.append("**Sisältö ja otsikkorakenne:**")
    lines.append("")
    for tag, text in dedupe_consecutive(ex.items):
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            lines.append(f"**[{tag.upper()}]** {text}")
        elif tag == "li":
            lines.append(f"- {text}")
        elif tag == "blockquote":
            lines.append(f"> {text}")
        else:
            lines.append(text)
        lines.append("")
    return "\n".join(lines)


def main():
    out = [
        "# Hyvän Tuulen Sauna — sivuston sisältöexportti",
        "",
        "Kaikkien sivujen tekstit ja otsikkorakenne, suomeksi ja englanniksi.",
        "Generoitu live-sivustosta. Otsikkotasot merkitty [H1]–[H4]. Navigaatio, footer ja painikkeet on jätetty pois.",
        "",
    ]
    for name, fi_path, en_path in PAGES:
        out.append("\n---\n")
        out.append(f"# SIVU: {name}\n")
        out.append("## Suomeksi (FI)\n")
        try:
            out.append(render_page(BASE + fi_path))
        except Exception as e:
            out.append(f"(virhe: {e})")
        out.append("\n## In English (EN)\n")
        try:
            out.append(render_page(BASE + en_path))
        except Exception as e:
            out.append(f"(virhe: {e})")

    dest = "/Users/kallevaltokari/Desktop/site-content-export.md"
    with open(dest, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    print(f"OK -> {dest}")


if __name__ == "__main__":
    main()
