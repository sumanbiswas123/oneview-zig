const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const version = pkg.version;
const tagName = `v${version}`;
const releaseName = `OneView v${version}`;
const installerPath = path.join(__dirname, '..', 'OneViewSetup.exe');

// Check token from env or git credential
let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
  try {
    const cred = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n\n',
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    const match = cred.match(/password=(.+)/);
    if (match && match[1]) {
      token = match[1].trim();
    }
  } catch (_e) {}
}

if (!token) {
  console.error('\x1b[31mError: GITHUB_TOKEN or GH_TOKEN environment variable is not set.\x1b[0m');
  console.error('Please run: $env:GITHUB_TOKEN="your_token" before publishing.');
  process.exit(1);
}

if (!fs.existsSync(installerPath)) {
  console.error(`\x1b[31mError: ${installerPath} not found! Please build the installer first.\x1b[0m`);
  process.exit(1);
}

const owner = 'sumanbiswas123';
const repo = 'oneview-zig';

function httpsRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json, rawBody: body });
        } catch (_e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body, rawBody: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      if (Buffer.isBuffer(data) || typeof data === 'string') {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

async function main() {
  console.log(`\x1b[36mPublishing OneView ${tagName} to https://github.com/${owner}/${repo}...\x1b[0m`);

  // 1. Check if release with tagName already exists
  console.log(`Checking existing release for ${tagName}...`);
  let release = null;
  const existingRes = await httpsRequest({
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/releases/tags/${tagName}`,
    method: 'GET',
    headers: {
      'User-Agent': 'OneView-Publisher',
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (existingRes.status === 200 && existingRes.data && existingRes.data.id) {
    console.log(`Release ${tagName} already exists (ID: ${existingRes.data.id}). Using it.`);
    release = existingRes.data;
  } else {
    // Create new release
    console.log(`Creating release ${tagName}...`);
    const createRes = await httpsRequest({
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/releases`,
      method: 'POST',
      headers: {
        'User-Agent': 'OneView-Publisher',
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, {
      tag_name: tagName,
      target_commitish: 'main',
      name: releaseName,
      body: `Release ${releaseName}\n\nAutomated release build with installer.`,
      draft: false,
      prerelease: false
    });

    if (createRes.status !== 201 && createRes.status !== 200) {
      console.error('\x1b[31mFailed to create release:\x1b[0m', createRes.data);
      process.exit(1);
    }
    release = createRes.data;
    console.log(`Release created successfully! (ID: ${release.id})`);
  }

  // 2. If asset OneViewSetup.exe exists on release, delete it first
  if (Array.isArray(release.assets)) {
    const existingAsset = release.assets.find(a => a.name === 'OneViewSetup.exe');
    if (existingAsset) {
      console.log(`Deleting old asset ${existingAsset.name} (ID: ${existingAsset.id})...`);
      await httpsRequest({
        hostname: 'api.github.com',
        path: `/repos/${owner}/${repo}/releases/assets/${existingAsset.id}`,
        method: 'DELETE',
        headers: {
          'User-Agent': 'OneView-Publisher',
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
    }
  }

  // 3. Upload OneViewSetup.exe
  console.log(`Uploading ${installerPath} (${(fs.statSync(installerPath).size / (1024 * 1024)).toFixed(2)} MB)...`);
  const uploadUrlRaw = release.upload_url.split('{')[0];
  const uploadUrl = new URL(uploadUrlRaw);
  uploadUrl.searchParams.set('name', 'OneViewSetup.exe');

  const fileStream = fs.readFileSync(installerPath);

  const uploadRes = await httpsRequest({
    hostname: uploadUrl.hostname,
    path: `${uploadUrl.pathname}${uploadUrl.search}`,
    method: 'POST',
    headers: {
      'User-Agent': 'OneView-Publisher',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileStream.length,
      'Accept': 'application/vnd.github.v3+json'
    }
  }, fileStream);

  if (uploadRes.status === 201 || uploadRes.status === 200) {
    console.log(`\x1b[32mSuccessfully published ${releaseName}!\x1b[0m`);
    console.log(`View release at: ${release.html_url}`);
  } else {
    console.error('\x1b[31mFailed to upload installer asset:\x1b[0m', uploadRes.data);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\x1b[31mPublish error:\x1b[0m', err);
  process.exit(1);
});
