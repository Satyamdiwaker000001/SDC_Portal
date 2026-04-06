import sys
import os

# Adjust path to import from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "backend", "app")))

from core.utils import generate_scifi_id

test_projects = ["phishgaurd", "Vortex", "SecureShell", "SDC_Portal"]

for p in test_projects:
    p_id = generate_scifi_id(p)
    print(f"Project: {p:15} -> ID: {p_id}")
