// Small Mac launcher used by package.json. No global shell settings are changed.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, delimiter, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [command, ...extra] = process.argv.slice(2);
const env = { ...process.env };
env.ANDROID_HOME ||= env.ANDROID_SDK_ROOT || join(homedir(), 'Library/Android/sdk');
env.ANDROID_SDK_ROOT ||= env.ANDROID_HOME;

// Gradle must see the same Node that launched this script (including NVM).
env.PATH = [dirname(process.execPath), join(env.ANDROID_HOME, 'platform-tools'),
  join(env.ANDROID_HOME, 'emulator'), '/opt/homebrew/bin', env.PATH]
  .filter(Boolean).join(delimiter);

if (!env.JAVA_HOME && process.platform === 'darwin') {
  for (const version of ['21', '17']) {
    const result = spawnSync('/usr/libexec/java_home', ['-v', version], { encoding: 'utf8' });
    if (result.status === 0) {
      env.JAVA_HOME = result.stdout.trim();
      break;
    }
  }
}
if (env.JAVA_HOME) env.PATH = `${join(env.JAVA_HOME, 'bin')}${delimiter}${env.PATH}`;

function run(binary, args, cwd = root) {
  const result = spawnSync(binary, args, { cwd, env, stdio: 'inherit' });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exitCode = result.status ?? 1;
}

const expo = join(root, 'node_modules/expo/bin/cli');
const commands = {
  start: ['start', '--dev-client'],
  android: ['start', '--dev-client', '--android'],
  ios: ['start', '--dev-client', '--ios'],
  'build:android': ['run:android'],
  'build:ios': ['run:ios'],
};

if (command === 'check') {
  console.log(`Project: ${root}\nNode: ${process.version} (${process.execPath})`);
  console.log(`Android SDK: ${env.ANDROID_HOME}\nJava: ${env.JAVA_HOME || 'not found'}`);
  for (const [binary, args] of [
    [join(env.ANDROID_HOME, 'emulator/emulator'), ['-list-avds']],
    [join(env.ANDROID_HOME, 'platform-tools/adb'), ['devices']],
    ['/usr/bin/xcrun', ['simctl', 'list', 'devices', 'available']],
  ]) {
    const result = spawnSync(binary, args, { env, stdio: 'inherit' });
    if (result.error) console.error(`${binary}: ${result.error.message}`);
    if (result.error || result.status !== 0) process.exitCode = 1;
  }
} else if (command === 'apk') {
  if (!existsSync(join(root, 'android/gradlew'))) {
    console.error('Android project missing. Run npm run build:android once first.');
    process.exit(1);
  }
  run('./gradlew', ['app:assembleRelease', ...extra], join(root, 'android'));
  if (!process.exitCode) console.log(`APK: ${join(root, 'android/app/build/outputs/apk/release/app-release.apk')}`);
} else if (commands[command]) {
  run(process.execPath, [expo, ...commands[command], ...extra]);
} else {
  console.error('Use start, android, ios, build:android, build:ios, apk, or check.');
  process.exitCode = 1;
}
