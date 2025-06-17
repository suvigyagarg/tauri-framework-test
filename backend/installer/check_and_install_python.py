import os
import platform
import shutil
import subprocess
import sys

def is_python_installed():
    return shutil.which("python3") is not None or shutil.which("python") is not None

def install_python_windows():
    installer = "python-3.12.0-amd64.exe"
    if not os.path.exists(installer):
        print(f"Installer {installer} not found.")
        return False

    print("Running Windows Python installer...")
    subprocess.run([installer, "/quiet", "InstallAllUsers=1", "PrependPath=1"], check=True)
    return True

def install_python_mac():
    installer = "python-3.12.0-macos.pkg"
    if not os.path.exists(installer):
        print(f"Installer {installer} not found.")
        return False

    print("Running macOS Python installer...")
    subprocess.run(["sudo", "installer", "-pkg", installer, "-target", "/"], check=True)
    return True

def main():
    if is_python_installed():
        print("Python is already installed.")
    else:
        print("Python not found. Installing now...")

        system = platform.system()

        if system == "Windows":
            success = install_python_windows()
        elif system == "Darwin":
            success = install_python_mac()
        else:
            print(f"Unsupported OS: {system}")
            success = False

        if success:
            print("Python installed successfully.")
        else:
            print("Python installation failed.")

if __name__ == "__main__":
    main()
