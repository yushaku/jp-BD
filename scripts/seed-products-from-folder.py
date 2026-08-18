#!/usr/bin/env python3
"""Wrapper — prefer bash seeder inside one wpcli container.

  python3 scripts/seed-products-from-folder.py
  # or:
  docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/seed-products-from-folder.sh
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    cmd = [
        "docker",
        "compose",
        "--profile",
        "cli",
        "run",
        "--rm",
        "--entrypoint",
        "bash",
        "wpcli",
        "/scripts/seed-products-from-folder.sh",
    ]
    print("[seed] ", " ".join(cmd))
    return subprocess.call(cmd, cwd=ROOT)


if __name__ == "__main__":
    sys.exit(main())
