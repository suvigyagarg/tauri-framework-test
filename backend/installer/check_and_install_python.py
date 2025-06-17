import subprocess
import sys
import winreg
from pathlib import Path

INSTALLER_NAME = "python-3.12.0-amd64.exe"  
APP_EXECUTABLE = "MyTauriApp.exe"           

def is_python_installed():
    try:
        
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Python\PythonCore\3.12\InstallPath")
        winreg.CloseKey(key)
        print(" Python found.")
        return True
    except FileNotFoundError:
        pass

    try:
        
        output = subprocess.check_output(["python", "--version"], stderr=subprocess.STDOUT)
        print(f" Python found in PATH: {output.decode().strip()}")
        return True
    except Exception:
        pass

    print(" Python not found.")
    return False


def install_python_silently():
    installer_path = Path(__file__).parent / INSTALLER_NAME
    if not installer_path.exists():
        print(f" Python installer not found at: {installer_path}")
        sys.exit(1)

    print(" Installing Python...")
    try:
        subprocess.run(
            [str(installer_path), "/quiet", "InstallAllUsers=1", "PrependPath=1", "Include_test=0"],
            check=True
        )
        print(" Python installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"  installation failed: {e}")
        sys.exit(1)


def run_tauri_app():
    app_path = Path(__file__).parent / APP_EXECUTABLE
    if not app_path.exists():
        print(f" Tauri app not found: {app_path}")
        sys.exit(1)

    print(f" Launching app: {APP_EXECUTABLE}")
    subprocess.Popen([str(app_path)], shell=True)

def main():
    if not is_python_installed():
        install_python_silently()
    run_tauri_app()

if __name__ == "__main__":
    main()
