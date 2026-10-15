"""Builds the MOS Hub templates in docker/ from the Unraid templates in unraid-apps.

unraid-apps stays the only place a template is edited. This script reads the
apps listed in apps.json from a checkout of it and writes one JSON file per app
in the layout of ich777/mos-templates.

    python tools/generate.py ../unraid-apps          write docker/
    python tools/generate.py ../unraid-apps --check  fail if docker/ is stale
"""

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# MOS has no user share. Appdata lives on a pool, and its docs ask templates to
# point at /mnt/cache so they work the same on every install.
HOST_PATHS = [
    ("/mnt/user/appdata", "/mnt/cache/appdata"),
    ("/mnt/user", "/mnt/cache"),
]

# The MOS default user. Unraid's 99:100 (nobody:users) does not exist there.
MOS_ID = "500"

# MOS appends the system timezone to every container it starts, after the
# template's own variables, so a TZ field would only look editable.
DROPPED_VARIABLES = {"TZ"}


def text(root, tag):
    value = root.findtext(tag)
    if value is None:
        return None
    value = value.strip()
    return value or None


def host_path(path):
    for unraid, mos in HOST_PATHS:
        if path == unraid or path.startswith(unraid + "/"):
            return mos + path[len(unraid):]
    return path


def mount_mode(mode):
    # /mnt is not a shared mount on MOS, so Docker refuses slave propagation.
    parts = [p for p in (mode or "rw").split(",") if p not in ("slave", "rslave", "shared", "rshared")]
    return ",".join(parts) or "rw"


def config_value(config):
    value = (config.text or "").strip()
    if value:
        return value
    default = config.get("Default", "")
    # A "|" separated default is Unraid's dropdown; the first entry is the
    # preselected one.
    return default.split("|")[0] if default else ""


def boolean(value):
    return str(value).lower() == "true"


def repository_of(root):
    for tag in ("ReadMe", "Project", "Support"):
        match = re.match(r"https://github\.com/(junkerderprovinz/[^/]+)", text(root, tag) or "")
        if match:
            return match.group(1)
    return None


def convert(xml_path, overrides):
    root = ET.parse(xml_path).getroot()
    repo = repository_of(root)

    paths, ports, variables, devices, labels = [], [], [], [], []
    for config in root.iter("Config"):
        kind = config.get("Type")
        name = config.get("Name")
        target = config.get("Target")
        description = config.get("Description", "")
        required = boolean(config.get("Required"))
        value = config_value(config)

        if kind == "Path":
            paths.append({
                "name": name,
                "host": host_path(value),
                "container": target,
                "mode": mount_mode(config.get("Mode")),
                "description": description,
                "required": required,
            })
        elif kind == "Port":
            ports.append({
                "name": name,
                "host": value,
                "container": target,
                "protocol": config.get("Mode") or "tcp",
                "description": description,
                "required": required,
                "mask": False,
            })
        elif kind == "Variable":
            if target in DROPPED_VARIABLES:
                continue
            if target in ("PUID", "PGID"):
                value = MOS_ID
            variables.append({
                "name": name,
                "key": target,
                "value": value or None,
                "description": description,
                "required": required,
                "mask": boolean(config.get("Mask")),
                "display": config.get("Display") or "always",
                "default": None,
            })
        elif kind == "Device":
            devices.append({"name": name, "host": value, "container": target or value,
                            "description": description, "required": required})
        elif kind == "Label":
            labels.append({"name": name, "key": target, "value": value, "description": description})

    template = {
        "name": text(root, "Name"),
        "repo": text(root, "Repository"),
        "registry": text(root, "Registry"),
        "network": text(root, "Network") or "bridge",
        "custom_ip": None,
        "default_shell": text(root, "Shell") or "sh",
        "privileged": boolean(text(root, "Privileged")),
        "extra_parameters": text(root, "ExtraParams"),
        "post_parameters": text(root, "PostArgs"),
        "cpu_set": None,
        "web_ui_url": text(root, "WebUI"),
        "icon": text(root, "Icon"),
        "category": overrides["category"],
        "project": text(root, "Project"),
        "support": f"https://github.com/{repo}/issues" if repo else text(root, "Support"),
        "readme_url": text(root, "ReadMe"),
        "description": text(root, "Overview"),
        "donate": text(root, "DonateLink"),
        "requires": text(root, "Requires"),
        "paths": paths,
        "ports": ports,
        "variables": variables,
        "devices": devices,
        "labels": labels,
    }
    template.update(overrides.get("set", {}))
    return template


def main():
    parser = argparse.ArgumentParser(description="Build the MOS Hub templates from unraid-apps.")
    parser.add_argument("feed", type=Path, help="checkout of junkerderprovinz/unraid-apps")
    parser.add_argument("--check", action="store_true", help="report stale files instead of writing")
    args = parser.parse_args()

    apps = json.loads((ROOT / "apps.json").read_text(encoding="utf-8"))
    out = ROOT / "docker"
    out.mkdir(exist_ok=True)

    wanted = {}
    for app, overrides in apps.items():
        template = convert(args.feed / app / f"{app}.xml", overrides)
        wanted[f"{template['name']}.json"] = json.dumps(template, indent=2, ensure_ascii=False) + "\n"

    stale = []
    for name, content in wanted.items():
        target = out / name
        if not target.exists() or target.read_text(encoding="utf-8") != content:
            stale.append(name)
            if not args.check:
                target.write_text(content, encoding="utf-8", newline="\n")
    for leftover in sorted(p.name for p in out.glob("*.json") if p.name not in wanted):
        stale.append(leftover)
        if not args.check:
            (out / leftover).unlink()

    if args.check and stale:
        print("out of date: " + ", ".join(stale), file=sys.stderr)
        print("run: python tools/generate.py <unraid-apps checkout>", file=sys.stderr)
        return 1
    for name in stale:
        print(f"updated {name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
