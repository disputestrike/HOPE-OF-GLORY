#!/usr/bin/env python3
"""
Build free PDF ebooks from every Markdown manuscript in content/books/.

For each content/books/<slug>.md, writes public/ebooks/<slug>-hope-of-glory.pdf.
Title, subtitle, and the cover verse(s) are read from the manuscript's front
matter (the first `# `, `### `, and `> ` lines), so adding a new book is just
dropping a new .md file and re-running:

    pnpm ebook:build

Pure-Python (reportlab). Greek renders natively (LTR) in Arial; Hebrew runs are
stripped of niqqud and reversed for correct visual right-to-left order, with the
scholarly transliteration carrying the vowels.
"""
import glob
import os
import re
import sys

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
    TableStyle, PageBreak, HRFlowable,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOKS_DIR = os.path.join(ROOT, "content", "books")
OUT_DIR = os.path.join(ROOT, "public", "ebooks")

NAVY = HexColor(0x0B1F3A)
GOLD = HexColor(0xD4AF37)
INK = HexColor(0x1A1A1A)
MUTED = HexColor(0x5B5B5B)

FONTS = {
    "Arial": "C:/Windows/Fonts/arial.ttf",
    "Arial-Bold": "C:/Windows/Fonts/arialbd.ttf",
    "Arial-Italic": "C:/Windows/Fonts/ariali.ttf",
    "Arial-BoldItalic": "C:/Windows/Fonts/arialbi.ttf",
}
for name, path in FONTS.items():
    pdfmetrics.registerFont(TTFont(name, path))
pdfmetrics.registerFontFamily(
    "Arial", normal="Arial", bold="Arial-Bold",
    italic="Arial-Italic", boldItalic="Arial-BoldItalic",
)

NIQQUD = re.compile(r"[֑-ׇ]")
HEBREW_RUN = re.compile(r"[֐-׿][֐-׿ ‏‎]*")


def fix_rtl(text: str) -> str:
    def repl(m: "re.Match[str]") -> str:
        run = NIQQUD.sub("", m.group(0))
        return run[::-1]
    return HEBREW_RUN.sub(repl, text)


def _esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(text: str) -> str:
    """Markdown emphasis -> reportlab markup, well-nested via a stack toggler."""
    text = fix_rtl(text)
    out: list = []
    stack: list = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if ch == "*":
            if text[i:i + 2] == "**":
                marker, i = "b", i + 2
            else:
                marker, i = "i", i + 1
            if marker in stack:
                reopen = []
                while stack:
                    t = stack.pop()
                    out.append(f"</{t}>")
                    if t == marker:
                        break
                    reopen.append(t)
                for t in reversed(reopen):
                    stack.append(t)
                    out.append(f"<{t}>")
            else:
                stack.append(marker)
                out.append(f"<{marker}>")
        else:
            j = i
            while j < n and text[j] != "*":
                j += 1
            out.append(_esc(text[i:j]))
            i = j
    while stack:
        out.append(f"</{stack.pop()}>")
    return "".join(out).replace("—", "&mdash;").replace("–", "&ndash;")


def style(name, **kw):
    base = dict(fontName="Arial", fontSize=11, leading=16.5, textColor=INK,
                spaceAfter=9, alignment=TA_LEFT)
    base.update(kw)
    return ParagraphStyle(name, **base)


S = {
    "title": style("title", fontName="Arial-Bold", fontSize=30, leading=34,
                   textColor=NAVY, alignment=TA_CENTER, spaceAfter=14),
    "subtitle": style("subtitle", fontName="Arial-Italic", fontSize=14.5,
                      leading=20, textColor=MUTED, alignment=TA_CENTER, spaceAfter=22),
    "cover_meta": style("cover_meta", fontName="Arial", fontSize=11, leading=16,
                        textColor=MUTED, alignment=TA_CENTER),
    "cover_verse": style("cover_verse", fontName="Arial-Italic", fontSize=13,
                         leading=19, textColor=NAVY, alignment=TA_CENTER, spaceAfter=4),
    "h1": style("h1", fontName="Arial-Bold", fontSize=22, leading=27,
                textColor=NAVY, spaceBefore=8, spaceAfter=14),
    "h2": style("h2", fontName="Arial-Bold", fontSize=17, leading=22,
                textColor=NAVY, spaceBefore=18, spaceAfter=10),
    "h3": style("h3", fontName="Arial-Bold", fontSize=13, leading=18,
                textColor=HexColor(0x7A5C12), spaceBefore=12, spaceAfter=6),
    "h4": style("h4", fontName="Arial-Bold", fontSize=11.5, leading=16,
                textColor=INK, spaceBefore=8, spaceAfter=4),
    "body": style("body"),
    "quote": style("quote", fontName="Arial-Italic", fontSize=11.5, leading=17,
                   textColor=NAVY, leftIndent=18, rightIndent=10, spaceBefore=4, spaceAfter=10),
    "li": style("li", leftIndent=16, spaceAfter=5),
    "cell": style("cell", fontSize=9.5, leading=13, spaceAfter=0),
    "cellh": style("cellh", fontName="Arial-Bold", fontSize=9.5, leading=13,
                   textColor=HexColor(0xFFFFFF), spaceAfter=0),
}

_running_title = "Hope of Glory Ministry"


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Arial", 8)
    canvas.setFillColor(MUTED)
    if doc.page > 1:
        canvas.drawString(inch, 0.6 * inch, _running_title)
        canvas.drawRightString(LETTER[0] - inch, 0.6 * inch, "Hope of Glory Ministry")
        canvas.drawCentredString(LETTER[0] / 2, 0.6 * inch, str(doc.page))
    canvas.restoreState()


def extract_meta(md: str) -> dict:
    title, subtitle = "", ""
    verses = []
    for line in md.split("\n"):
        s = line.strip()
        if s.startswith("## "):
            break  # end of front matter
        if s.startswith("# ") and not title:
            title = s[2:].strip()
        elif s.startswith("### ") and not subtitle:
            subtitle = s[4:].strip()
        elif s.startswith("> ") and len(verses) < 2:
            q = s[2:].strip()
            if " — " in q:
                quote, ref = q.rsplit(" — ", 1)
            else:
                quote, ref = q, ""
            verses.append((quote.strip().strip("“”\""), ref.strip()))
    return {"title": title, "subtitle": subtitle, "verses": verses}


def cover_flow(meta: dict) -> list:
    flow = [Spacer(1, 1.5 * inch), Paragraph(inline(meta["title"]), S["title"])]
    flow.append(HRFlowable(width="40%", thickness=1.2, color=GOLD,
                           spaceBefore=2, spaceAfter=16, hAlign="CENTER"))
    if meta["subtitle"]:
        flow.append(Paragraph(inline(meta["subtitle"]), S["subtitle"]))
    flow.append(Spacer(1, 0.5 * inch))
    for quote, ref in meta["verses"]:
        flow.append(Paragraph("&ldquo;" + inline(quote) + "&rdquo;", S["cover_verse"]))
        if ref:
            flow.append(Paragraph(inline(ref), S["cover_meta"]))
        flow.append(Spacer(1, 0.2 * inch))
    flow.append(Spacer(1, 0.9 * inch))
    flow.append(Paragraph("HOPE OF GLORY MINISTRY", S["cover_meta"]))
    flow.append(Paragraph("A free book &middot; hopeofglory.ministry", S["cover_meta"]))
    flow.append(PageBreak())
    return flow


def build_table(block):
    rows = []
    for r, row in enumerate(block):
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if r == 1 and all(set(c) <= set("-: ") for c in cells):
            continue
        rows.append(cells)
    header, body = rows[0], rows[1:]
    ncol = len(header)
    usable = LETTER[0] - 2 * inch
    data = [[Paragraph(inline(c), S["cellh"]) for c in header]]
    for row in body:
        row = (row + [""] * ncol)[:ncol]
        data.append([Paragraph(inline(c), S["cell"]) for c in row])
    t = Table(data, colWidths=[usable / ncol] * ncol, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [HexColor(0xFFFFFF), HexColor(0xF6F1E3)]),
        ("GRID", (0, 0), (-1, -1), 0.4, HexColor(0xD9C7A0)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def body_flow(md: str) -> list:
    flow = []
    lines = md.split("\n")
    i = 0
    started = False
    while i < len(lines):
        stripped = lines[i].strip()
        if not started:
            if stripped.startswith("## ") or stripped.startswith("# Chapter"):
                started = True
            else:
                i += 1
                continue
        if not stripped:
            i += 1
            continue
        if stripped == "---":
            flow.append(Spacer(1, 6))
            flow.append(HRFlowable(width="100%", thickness=0.6, color=GOLD,
                                   spaceBefore=4, spaceAfter=10))
            i += 1
            continue
        if stripped.startswith("|"):
            block = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                block.append(lines[i].strip())
                i += 1
            flow.append(build_table(block))
            flow.append(Spacer(1, 8))
            continue
        if stripped.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            flow.append(Paragraph(inline(" ".join(b for b in buf if b)), S["quote"]))
            continue
        if stripped.startswith("#### "):
            flow.append(Paragraph(inline(stripped[5:]), S["h4"])); i += 1; continue
        if stripped.startswith("### "):
            flow.append(Paragraph(inline(stripped[4:]), S["h3"])); i += 1; continue
        if stripped.startswith("## "):
            txt = stripped[3:]
            if txt.startswith("Chapter") or "Appendix" in txt:
                flow.append(PageBreak())
            flow.append(Paragraph(inline(txt), S["h2"])); i += 1; continue
        if stripped.startswith("# "):
            flow.append(PageBreak())
            flow.append(Paragraph(inline(stripped[2:]), S["h1"])); i += 1; continue
        if re.match(r"^[-*] ", stripped):
            while i < len(lines) and re.match(r"^[-*] ", lines[i].strip()):
                flow.append(Paragraph("&bull;&nbsp;&nbsp;" + inline(lines[i].strip()[2:]), S["li"]))
                i += 1
            continue
        if re.match(r"^\d+\. ", stripped):
            while i < len(lines) and re.match(r"^\d+\. ", lines[i].strip()):
                item = re.sub(r"^(\d+)\. ", r"<b>\1.</b>&nbsp;&nbsp;", lines[i].strip())
                flow.append(Paragraph(inline(re.sub(r"^\d+\. ", "", lines[i].strip())), S["li"]))
                i += 1
            continue
        flow.append(Paragraph(inline(stripped), S["body"]))
        i += 1
    return flow


def build_pdf(slug: str, md: str) -> tuple:
    global _running_title
    meta = extract_meta(md)
    _running_title = meta["title"].title() if meta["title"].isupper() else meta["title"]
    out = os.path.join(OUT_DIR, f"{slug}-hope-of-glory.pdf")
    doc = BaseDocTemplate(
        out, pagesize=LETTER, leftMargin=inch, rightMargin=inch,
        topMargin=inch, bottomMargin=0.9 * inch,
        title=f"{meta['title']} — Hope of Glory Ministry",
        author="Hope of Glory Ministry",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header_footer)])
    doc.build(cover_flow(meta) + body_flow(md))
    return out, doc.page


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    files = sorted(glob.glob(os.path.join(BOOKS_DIR, "*.md")))
    if not files:
        print("No manuscripts found in content/books/", file=sys.stderr)
        sys.exit(1)
    for path in files:
        slug = os.path.splitext(os.path.basename(path))[0]
        with open(path, encoding="utf-8") as f:
            md = f.read()
        out, pages = build_pdf(slug, md)
        print(f"OK  {slug}: {os.path.getsize(out)//1024} KB, {pages} pages")


if __name__ == "__main__":
    main()
