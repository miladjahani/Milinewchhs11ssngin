import os
import sys
import importlib.util

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

# Ensure app package is registered in sys.modules for any environment
if "app" not in sys.modules:
    app_dir = os.path.join(CURRENT_DIR, "app")
    spec = importlib.util.spec_from_file_location("app", os.path.join(app_dir, "__init__.py"), submodule_search_locations=[app_dir])
    app_mod = importlib.util.module_from_spec(spec)
    sys.modules["app"] = app_mod
    spec.loader.exec_module(app_mod)

import uvicorn
from app.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[*] Starting MILICONFIG on {host}:{port} ...")
    uvicorn.run(app, host=host, port=port, log_level="info")
