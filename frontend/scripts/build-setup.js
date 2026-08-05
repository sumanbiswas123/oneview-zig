const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (!pkg.version) {
  console.error('[build-setup] Error: package.json does not contain a valid version!');
  process.exit(1);
}
const version = pkg.version;

const localAppData = process.env.LOCALAPPDATA || '';
const localIscc = path.join(localAppData, 'Programs', 'Inno Setup 6', 'ISCC.exe');
const progFilesIscc = 'C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe';

let isccExe = 'iscc';

if (fs.existsSync(localIscc)) {
  isccExe = `"${localIscc}"`;
} else if (fs.existsSync(progFilesIscc)) {
  isccExe = `"${progFilesIscc}"`;
}

const issFile = path.resolve(__dirname, '..', '..', 'oneview.iss');

console.log(`[build-setup] Compiling ${issFile} (v${version}) using ${isccExe}...`);

try {
  execSync(`${isccExe} "/DMyAppVersion=${version}" "${issFile}"`, { stdio: 'inherit' });
  console.log(`[build-setup] Setup build completed successfully: OneView.Setup.${version}.exe`);
} catch (err) {
  console.error('[build-setup] Error compiling setup installer:', err.message);
  process.exit(1);
}
