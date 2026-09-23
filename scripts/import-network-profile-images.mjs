import { readFileSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

// Resumable import of already-published directory images. No email paths.
const apply = process.argv.includes('--apply');
const targetFlag = process.argv.indexOf('--target');
const target = targetFlag >= 0 ? process.argv[targetFlag + 1] : 'staging';
if (target !== 'staging' && target !== 'production') throw new Error('--target must be staging or production');
const database = target === 'staging' ? 'nami-network-staging' : 'nami-network';
const manifestFlag = process.argv.indexOf('--manifest');
const manifestPath = manifestFlag >= 0 ? process.argv[manifestFlag + 1] : new URL('./network-image-import-manifest.json', import.meta.url);
if (!manifestPath) throw new Error('--manifest needs a file path');
const manifest = JSON.parse(readFileSync(manifestPath));
const run = (file, args, options = {}) => execFileSync(file, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options });
const wranglerCli = join(process.cwd(), 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const wrangler = (...args) => {
  const command = [wranglerCli, 'd1', 'execute', database];
  if (target === 'staging') command.push('--env', 'staging');
  command.push('--remote', '--command', args.join(' '), '--json');
  return JSON.parse(run(process.execPath, command))[0].results;
};
const profiles = wrangler('SELECT member_id, profile_image_key FROM member_profiles');
const current = new Map(profiles.map(({ member_id, profile_image_key }) => [member_id, profile_image_key]));
const todo = manifest.filter(({ id }) => current.has(id) && !current.get(id));
console.log(JSON.stringify({ mode: apply ? `${target} import` : 'dry run', target, available: manifest.length, matching: manifest.filter(({ id }) => current.has(id)).length, toImport: todo.length, unmatched: manifest.filter(({ id }) => !current.has(id)).map(({ id }) => id) }));
if (!apply) process.exit(0);
const temporary = mkdtempSync(join(tmpdir(), 'nami-profile-import-'));
let imported = 0, failed = 0;
try {
  for (const { id, source } of todo) {
    const driveId = new URL(source).searchParams.get('id');
    if (!driveId || !/^[\w-]+$/.test(driveId)) { console.log(`${id}: invalid source`); failed++; continue; }
    const original = join(temporary, `${id}.source`);
    const image = join(temporary, `${id}.webp`);
    const key = `network-members/${id}/profile/sheet-import-${driveId}.webp`;
    try {
      run('curl.exe', ['-L', '--fail', '--silent', '--show-error', '--max-time', '45', '-o', original, `https://drive.google.com/uc?export=download&id=${driveId}`]);
      run('ffmpeg.exe', ['-nostdin', '-loglevel', 'error', '-y', '-i', original, '-vf', 'scale=800:800:force_original_aspect_ratio=increase,crop=800:800', '-frames:v', '1', image]);
      if (statSync(image).size < 1000 || statSync(image).size > 2_000_000) throw new Error('Converted image size invalid');
      run(process.execPath, [wranglerCli, 'r2', 'object', 'put', `nami-creative/${key}`, '--file', image, '--content-type', 'image/webp', '--remote']);
      const changed = wrangler(`UPDATE member_profiles SET profile_image_key = '${key}' WHERE member_id = '${id}' AND profile_image_key IS NULL RETURNING member_id`);
      if (changed.length !== 1) throw new Error('Profile changed before update; R2 object needs review');
      imported++; console.log(`${id}: imported`);
    } catch (error) { failed++; console.log(`${id}: ${String(error.stderr ?? error.message).slice(0,240)}`); }
    finally { rmSync(original, { force: true }); rmSync(image, { force: true }); }
  }
} finally { rmSync(temporary, { recursive: true, force: true }); }
console.log(JSON.stringify({ imported, failed }));
if (failed) process.exitCode = 1;
