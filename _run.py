from pathlib import Path
import subprocess

p = Path("/mnt/d/aittorney/scaurus-web/_commit.sh")
p.write_bytes(p.read_bytes().replace(b"\r\n", b"\n"))
subprocess.check_call(["zsh", str(p)])
