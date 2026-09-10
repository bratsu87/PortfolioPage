from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
)


OUTPUT = "Brandon_Tsueda_Resume.pdf"


def p(text, style):
    return Paragraph(text, style)


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="Name",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=25,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Headline",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor("#1E3A5F"),
        alignment=1,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="Contact",
        parent=styles["Normal"],
        fontSize=8.6,
        leading=10.5,
        alignment=1,
        textColor=colors.HexColor("#334155"),
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=12,
        textColor=colors.HexColor("#0F172A"),
        borderColor=colors.HexColor("#CBD5E1"),
        borderWidth=0,
        borderPadding=0,
        spaceBefore=8,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["Normal"],
        fontSize=8.8,
        leading=11.2,
        textColor=colors.HexColor("#111827"),
    )
)
styles.add(
    ParagraphStyle(
        name="Role",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.2,
        leading=11,
        textColor=colors.HexColor("#111827"),
        spaceBefore=3,
        spaceAfter=1,
    )
)
styles.add(
    ParagraphStyle(
        name="Meta",
        parent=styles["Normal"],
        fontSize=8.2,
        leading=10,
        textColor=colors.HexColor("#475569"),
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeBullet",
        parent=styles["Normal"],
        fontSize=8.45,
        leading=10.25,
        textColor=colors.HexColor("#111827"),
        leftIndent=0,
    )
)


def section(title):
    return [
        Spacer(1, 4),
        p(title.upper(), styles["Section"]),
        Table([[""]], colWidths=[7.25 * inch], rowHeights=[1], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#1E3A5F")),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ])),
        Spacer(1, 3),
    ]


def bullets(items):
    return [p(f"- {item}", styles["ResumeBullet"]) for item in items]


doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=LETTER,
    rightMargin=0.55 * inch,
    leftMargin=0.55 * inch,
    topMargin=0.45 * inch,
    bottomMargin=0.45 * inch,
)

story = []
story.append(p("BRANDON TSUEDA", styles["Name"]))
story.append(p("Network Engineer | Cybersecurity | Infrastructure Operations", styles["Headline"]))
story.append(
    p(
        "Louisville, KY | (502) 676-8984 | brandon.tsueda@live.com | "
        "linkedin.com/in/brandontsueda | brandontsueda.com | github.com/BrandonTsueda",
        styles["Contact"],
    )
)

story += section("Professional Summary")
story.append(
    p(
        "Network engineer with enterprise NOC experience, cybersecurity training, and hands-on infrastructure ownership. "
        "Experienced in monitoring large-scale environments, triaging alerts, documenting incident context, supporting "
        "DNS and firewall workflows, and troubleshooting across network, systems, and application layers. Holds a Master "
        "of Science in Business Intelligence, Bachelor of Science in Cybersecurity, and Associate of Science in "
        "Information Technology. Strong foundation across Linux/Windows systems, automation, monitoring, dashboards, "
        "secure access, and self-hosted infrastructure.",
        styles["Body"],
    )
)

story += section("Core Skills")
skills_data = [
    ["Network Operations", "DNS, DHCP, TCP/IP, VPNs, SSL/TLS, IPsec, SolarWinds, Dynatrace, ServiceNow, alert triage"],
    ["Security", "Nessus, Nmap, Wireshark, Metasploit, Burp Suite, OpenSSL, CyberChef, OWASP, MITRE ATT&amp;CK"],
    ["Systems", "Linux, Windows Server, Windows 10/11, Azure, VMware, ESXi, KVM, Proxmox, Docker, Nginx"],
    ["Automation", "Python, PowerShell, Bash, Ansible, GitHub, API workflows, scripting, technical documentation"],
    ["Monitoring", "Service health, incident intake, escalation context, infrastructure visibility, operational reporting"],
    ["Analytics", "Power BI, Advanced Excel, KPI reporting, dashboards, trend analysis, dimensional modeling"],
]
skills_table = Table(
    [[p(f"<b>{k}</b>", styles["Body"]), p(v, styles["Body"])] for k, v in skills_data],
    colWidths=[1.45 * inch, 5.8 * inch],
)
skills_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
]))
story.append(skills_table)

story += section("Professional Experience")
story.append(p("Network Operations Center Engineer | Humana | Louisville, KY | April 2024 - Present", styles["Role"]))
story += bullets([
    "Monitor enterprise network activity, server health, and application signals across large-scale environments supporting 50,000+ servers and services.",
    "Investigate alerts and outage tickets using SolarWinds, Dynatrace, ServiceNow, and related operational tools.",
    "Support DNS and firewall change workflows while maintaining clear documentation, escalation context, and service-impact awareness.",
    "Apply structured troubleshooting across connectivity, routing, firewall, storage, services, containers/VMs, and application layers.",
])

story.append(p("Global Inside Partner Development Manager | Microsoft | Remote | Jan 2022 - Dec 2023", styles["Role"]))
story += bullets([
    "Supported global partner alliances with SAP, Bentley, and ESRI across cloud, SaaS, and platform solution motions.",
    "Managed SaaS/PaaS pipeline reporting exceeding $700M annually and produced reporting for executive stakeholders.",
    "Strengthened ability to connect technical solution value with customer needs, business outcomes, and stakeholder communication.",
])

story += section("Selected Projects")
story.append(p("Bratsu SecureOps", styles["Role"]))
story += bullets([
    "Developing an AI-assisted managed IT and cybersecurity platform for small-business asset visibility, findings, guided remediation, and auditable workflows.",
    "Designed around secure deployment, maintainable automation, and practical operational evidence rather than opaque AI actions.",
])
story.append(p("Proxmox Homelab Infrastructure", styles["Role"]))
story += bullets([
    "Maintain a production-style Proxmox environment with VMs, LXCs, Pi-hole DNS, Tailscale, Nginx reverse proxying, monitoring, backups, and self-hosted AI tooling.",
    "Use the lab to practice secure configuration, incident-style troubleshooting, service recovery, automation, and infrastructure documentation.",
])
story.append(p("Bratsu Agent, Ansible Console, and Observability", styles["Role"]))
story += bullets([
    "Operate private agent infrastructure spanning a Proxmox control plane and MSI AI workstation with persistent project context and controlled remote access.",
    "Built a Raspberry Pi Ansible control surface and Prometheus/Grafana fleet monitoring for repeatable maintenance and evidence-based recovery.",
])

story += section("Education")
story.append(p("Master of Science in Business Intelligence | Full Sail University", styles["Body"]))
story.append(p("Bachelor of Science in Cybersecurity | Full Sail University", styles["Body"]))
story.append(p("Associate of Science in Information Technology | Full Sail University", styles["Body"]))

story += section("Target Roles")
story.append(
    p(
        "Network Engineer, NOC Engineer, Systems Administrator, Cybersecurity Analyst, Security Operations Analyst, "
        "Infrastructure Support Engineer, Business Intelligence Analyst",
        styles["Body"],
    )
)

doc.build(story)
print(OUTPUT)
