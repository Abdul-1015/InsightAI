import subprocess
import sys
import os

# Get path of main.py relative to run.py
backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)

# Run uvicorn inside the virtual environment's python/sys.executable
# This ensures it uses the packages we just installed in our virtual environment!
python_bin = sys.executable
print(f"Starting InsightAI FastAPI server on http://127.0.0.1:8000...")
print(f"Press Ctrl+C to stop.")

try:
    subprocess.run([python_bin, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"], check=True)
except KeyboardInterrupt:
    print("\nInsightAI FastAPI server stopped.")
except Exception as e:
    print(f"Error starting server: {e}")
