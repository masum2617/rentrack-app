# Expo native path quoting

`expo-modules-core+58.0.24.patch` preserves the owner's working correction to the Android `generateStubPCH` task. The original code called `cmd.split(" ")`, splitting quoted paths containing spaces. The patch uses an argument list where available and otherwise parses quoted command text before constructing `ProcessBuilder`.

`npm ci`/`npm install` runs `patch-package --error-on-fail`. Keep this patch tied to the locked dependency version and reassess it when upgrading Expo. To regenerate deliberately, limit capture to `android/build.gradle`:

```sh
npx patch-package expo-modules-core --include '^android/build\.gradle$'
```

Do not capture `.cxx`, build outputs, Gradle caches, or local absolute paths in dependency patches.
