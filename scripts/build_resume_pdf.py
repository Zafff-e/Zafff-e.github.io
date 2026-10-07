"""Render src/data/resume.json to an A4 one-page PDF (ReportLab).

Usage: python3 scripts/build_resume_pdf.py [output.pdf]
"""
import json, sys
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

root = Path(__file__).resolve().parent.parent
data = json.loads((root / "src/data/resume.json").read_text(encoding="utf-8"))
out = sys.argv[1] if len(sys.argv) > 1 else str(root / "resume.pdf")
b = data["basics"]
e = escape

NAVY = colors.HexColor("#1f2d4d")
GREY = colors.HexColor("#555555")
base = ParagraphStyle("base", fontName="Helvetica", fontSize=8.6, leading=11)
name = ParagraphStyle("name", parent=base, fontName="Helvetica-Bold", fontSize=18, leading=22, alignment=TA_CENTER, textColor=NAVY)
head = ParagraphStyle("head", parent=base, fontName="Helvetica-Bold", fontSize=10, leading=13, alignment=TA_CENTER, textColor=GREY)
contact = ParagraphStyle("contact", parent=base, fontSize=8, alignment=TA_CENTER, textColor=GREY)
sec = ParagraphStyle("sec", parent=base, fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=NAVY, spaceBefore=7)
bullet = ParagraphStyle("bullet", parent=base, leftIndent=12, bulletIndent=3)
right = ParagraphStyle("right", parent=base, alignment=2, fontName="Helvetica-Oblique", textColor=GREY)
italic = ParagraphStyle("italic", parent=base, fontName="Helvetica-Oblique")

W = A4[0] - 2 * 36
def row(left, r):
    t = Table([[Paragraph(left, base), Paragraph(e(r), right)]], colWidths=[W * 0.78, W * 0.22])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 4),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return t
def section(title):
    return [Paragraph(title, sec), HRFlowable(width="100%", thickness=0.8, color=NAVY, spaceBefore=1, spaceAfter=2)]
def bullets(items):
    return [Paragraph(e(h), bullet, bulletText="•") for h in items]

contact_line = " • ".join([b["location"], b["phone"], b["email"]] + [p["display"] for p in b["profiles"]])
s = [Paragraph(e(b["name"].upper()), name), Paragraph(e(b["title"].upper()), head), Paragraph(e(contact_line), contact)]

s += section("TECHNICAL SKILLS")
for g in data["skills"]:
    s.append(Paragraph(f"<b>{e(g['category'])}:</b> {e(', '.join(g['items']))}", bullet, bulletText="•"))

s += section("SOFTWARE ENGINEERING PROJECTS")
for p in data["projects"]:
    s.append(row(f"<b>{e(p['name'])}</b> | {e(', '.join(p['tech']))}", p["tag"]))
    s += bullets(p["highlights"])

s += section("EXPERIENCE & TECHNICAL TRAINING")
for x in data["experience"]:
    s.append(row(f"<b>{e(x['company'])}</b> | {e(x['role'])}" if "|" not in x["company"] else f"<b>{e(x['company'])}</b>", x["period"]))
    if "|" in x["company"]:
        s.append(Paragraph(e(x["role"]), italic))
    s += bullets(x["highlights"])

s += section("EDUCATION")
for x in data["education"]:
    s.append(row(f"<b>{e(x['school'])}</b> — {e(x['degree'])}", x["period"]))
    s += bullets(x["highlights"])

SimpleDocTemplate(out, pagesize=A4, leftMargin=36, rightMargin=36, topMargin=30, bottomMargin=28,
                  title=f"{b['name']} — Resume", author=b["name"]).build(s)
print("wrote", out)
