#!/usr/bin/env python3
"""
Build the free PDF ebook from a Markdown manuscript.

Input:  content/books/i-am-he.md
Output: public/ebooks/i-am-he-hope-of-glory.pdf

Pure-Python (reportlab) so it runs without a browser or pandoc. Greek renders
natively (LTR) in Arial; Hebrew runs are stripped of niqqud and reversed so
short phrases display in correct visual right-to-left order in an LTR engine.
The scholarly transliteration that always accompanies the Hebrew carries the
vowel points, so nothing is lost. The web reader renders full pointed Hebrew.

Usage:  python scripts/build-ebook.py
"""
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
SRC = os.path.join(ROOT, "content", "books", "i-am-he.md")
OUT_DIR = os.path.join(ROOT, "public", "ebooks")
OUT = os.path.join(OUT_DIR, "i-am-he-hope-of-glory.pdf")

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

HEBREW = re.compile(r"[֐-׿֑-ׇ]")
NIQQUD = re.compile(r"[֑-ׇ]")
HEBREW_RUN = re.compile(r"[֐-׿][֐-׿ ‏‎]*")


def fix_rtl(text: str) -> str:
    """Strip niqqud and reverse Hebrew runs for correct visual order in LTR."""
    def repl(m: "re.Match[str]") -> str:
        run = NIQQUD.sub("", m.group(0))
        return run[::-1]
    return HEBREW_RUN.sub(repl, text)


def _esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(text: str) -> str:
    """Convert markdown emphasis to reportlab mini-markup with guaranteed
    well-nested tags (a stack-based toggler, not a regex). Handles arbitrary
    interleaving like ``**bold *italic***`` that breaks naive substitution."""
    text = fix_rtl(text)
    out: list[str] = []
    stack: list[str] = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if ch == "*":
            if text[i:i + 2] == "**":
                marker, i = "b", i + 2
            else:
                marker, i = "i", i + 1
            tag = "b" if marker == "b" else "i"
            if marker in stack:
                reopen: list[str] = []
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
                stack.append(tag)
                out.append(f"<{tag}>")
        else:
            j = i
            while j < n and text[j] != "*":
                j += 1
            out.append(_esc(text[i:j]))
            i = j
    while stack:
        out.append(f"</{stack.pop()}>")
    s = "".join(out)
    return s.replace("—", "&mdash;").replace("–", "&ndash;")


# ---- styles ----
def style(name, **kw):
    base = dict(fontName="Arial", fontSize=11, leading=16.5, textColor=INK,
                spaceAfter=9, alignment=TA_LEFT)
    base.update(kw)
    return ParagraphStyle(name, **base)


S = {
    "title": style("title", fontName="Arial-Bold", fontSize=30, leading=34,
                   textColor=NAVY, alignment=TA_CENTER, spaceAfter=14),
    "subtitle": style("subtitle", fontName="Arial-Italic", fontSize=14.5,
                      leading=20, textColor=MUTED, alignment=TA_CENTER,
                      spaceAfter=22),
    "cover_meta": style("cover_meta", fontName="Arial", fontSize=11,
                        leading=16, textColor=MUTED, alignment=TA_CENTER),
    "cover_verse": style("cover_verse", fontName="Arial-Italic", fontSize=13,
                         leading=19, textColor=NAVY, alignment=TA_CENTER,
                         spaceAfter=8),
    "h1": style("h1", fontName="Arial-Bold", fontSize=22, leading=27,
                textColor=NAVY, spaceBefore=8, spaceAfter=14),
    "h2": style("h2", fontName="Arial-Bold", fontSize=17, leading=22,
                textColor=NAVY, spaceBefore=18, spaceAfter=10),
    "h3": style("h3", fontName="Arial-Bold", fontSize=13, leading=18,
                textColor=HexColor(0x7A5C12), spaceBefore=12, spaceAfter=6),
    "h4": style("h4", fontName="Arial-Bold", fontSize=11.5, leading=16,
                textColor=INK, spaceBefore=8, spaceAfter=4),
    "body": style("body"),
    "quote": style("quote", fontName="Arial-Italic", fontSize=11.5,
                   leading=17, textColor=NAVY, leftIndent=18, rightIndent=10,
                   spaceBefore=4, spaceAfter=10),
    "li": style("li", leftIndent=16, spaceAfter=5),
    "cell": style("cell", fontSize=9.5, leading=13, spaceAfter=0),
    "cellh": style("cellh", fontName="Arial-Bold", fontSize=9.5, leading=13,
                   textColor=HexColor(0xFFFFFF), spaceAfter=0),
}


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Arial", 8)
    canvas.setFillColor(MUTED)
    if doc.page > 1:
        canvas.drawString(inch, 0.6 * inch, "I AM HE")
        canvas.drawRightString(LETTER[0] - inch, 0.6 * inch,
                               "Hope of Glory Ministry")
        canvas.drawCentredString(LETTER[0] / 2, 0.6 * inch, str(doc.page))
    canvas.restoreState()


def parse(md: str):
    flow = []
    lines = md.split("\n")
    i = 0
    # ---- cover ----
    flow.append(Spacer(1, 1.6 * inch))
    flow.append(Paragraph("I AM HE", S["title"]))
    flow.append(HRFlowable(width="40%", thickness=1.2, color=GOLD,
                           spaceBefore=2, spaceAfter=16, hAlign="CENTER"))
    flow.append(Paragraph(
        "The Absolute Formula &mdash; How the God of Israel Reveals "
        "Himself in Jesus the Messiah", S["subtitle"]))
    flow.append(Spacer(1, 0.5 * inch))
    flow.append(Paragraph("&ldquo;See now that I, even I, am he. "
                          "There is no god with me.&rdquo;", S["cover_verse"]))
    flow.append(Paragraph("Deuteronomy 32:39 &middot; WEB", S["cover_meta"]))
    flow.append(Spacer(1, 0.25 * inch))
    flow.append(Paragraph("&ldquo;Unless you believe that I am he, "
                          "you will die in your sins.&rdquo;", S["cover_verse"]))
    flow.append(Paragraph("John 8:24 &middot; WEB", S["cover_meta"]))
    flow.append(Spacer(1, 1.1 * inch))
    flow.append(Paragraph("HOPE OF GLORY MINISTRY", S["cover_meta"]))
    flow.append(Paragraph("A free book &middot; hopeofglory.ministry", S["cover_meta"]))
    flow.append(PageBreak())

    # Skip the manuscript's own cover block (down to first '## A Note' or '---')
    # We render everything after the first H1 line normally, but drop the
    # duplicate title/subtitle/byline that the markdown opens with.
    started = False
    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()
        stripped = line.strip()

        # Begin real content at the first "## " or "# Chapter"/"---" after intro
        if not started:
            if stripped.startswith("## ") or stripped.startswith("# Chapter"):
                started = True
            else:
                i += 1
                continue

        if not stripped:
            i += 1
            continue

        # Horizontal rule -> chapter divider / page break for big sections
        if stripped == "---":
            flow.append(Spacer(1, 6))
            flow.append(HRFlowable(width="100%", thickness=0.6, color=GOLD,
                                   spaceBefore=4, spaceAfter=10))
            i += 1
            continue

        # Tables
        if stripped.startswith("|"):
            block = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                block.append(lines[i].strip())
                i += 1
            flow.append(build_table(block))
            flow.append(Spacer(1, 8))
            continue

        # Blockquote (join consecutive > lines)
        if stripped.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            text = " ".join(b for b in buf if b)
            flow.append(Paragraph(inline(text), S["quote"]))
            continue

        # Headings
        if stripped.startswith("#### "):
            flow.append(Paragraph(inline(stripped[5:]), S["h4"]))
            i += 1
            continue
        if stripped.startswith("### "):
            flow.append(Paragraph(inline(stripped[4:]), S["h3"]))
            i += 1
            continue
        if stripped.startswith("## "):
            txt = stripped[3:]
            if txt.startswith("Chapter") or "Appendix" in txt:
                flow.append(PageBreak())
            flow.append(Paragraph(inline(txt), S["h2"]))
            i += 1
            continue
        if stripped.startswith("# "):
            flow.append(PageBreak())
            flow.append(Paragraph(inline(stripped[2:]), S["h1"]))
            i += 1
            continue

        # Lists
        if re.match(r"^[-*] ", stripped):
            buf = []
            while i < len(lines) and re.match(r"^[-*] ", lines[i].strip()):
                buf.append(lines[i].strip()[2:])
                i += 1
            for item in buf:
                flow.append(Paragraph("&bull;&nbsp;&nbsp;" + inline(item), S["li"]))
            continue
        if re.match(r"^\d+\. ", stripped):
            buf = []
            while i < len(lines) and re.match(r"^\d+\. ", lines[i].strip()):
                buf.append(re.sub(r"^\d+\. ", "", lines[i].strip()))
                i += 1
            for n, item in enumerate(buf, 1):
                flow.append(Paragraph(f"<b>{n}.</b>&nbsp;&nbsp;" + inline(item), S["li"]))
            continue

        # Paragraph (single line; manuscript uses one line per paragraph)
        flow.append(Paragraph(inline(stripped), S["body"]))
        i += 1

    return flow


def build_table(block):
    rows = []
    for r, row in enumerate(block):
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if r == 1 and all(set(c) <= set("-: ") for c in cells):
            continue  # separator row
        rows.append(cells)
    header, body = rows[0], rows[1:]
    ncol = len(header)
    usable = LETTER[0] - 2 * inch
    colw = [usable / ncol] * ncol
    data = [[Paragraph(inline(c), S["cellh"]) for c in header]]
    for row in body:
        row = (row + [""] * ncol)[:ncol]
        data.append([Paragraph(inline(c), S["cell"]) for c in row])
    t = Table(data, colWidths=colw, repeatRows=1)
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


def main():
    if not os.path.exists(SRC):
        print(f"ERROR: manuscript not found at {SRC}", file=sys.stderr)
        sys.exit(1)
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(SRC, encoding="utf-8") as f:
        md = f.read()

    doc = BaseDocTemplate(
        OUT, pagesize=LETTER,
        leftMargin=inch, rightMargin=inch,
        topMargin=inch, bottomMargin=0.9 * inch,
        title="I AM HE — Hope of Glory Ministry",
        author="Hope of Glory Ministry",
        subject="The Absolute Formula: How the God of Israel reveals Himself in Jesus",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height,
                  id="main")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame],
                                       onPage=header_footer)])
    flow = parse(md)
    doc.build(flow)
    size = os.path.getsize(OUT)
    print(f"OK  wrote {OUT}  ({size//1024} KB, {doc.page} pages)")


if __name__ == "__main__":
    main()
