/**
 * Custom entry point.
 *
 * TEMPORARY DEBUG INSTRUMENTATION: intercepts fatal JS errors that would
 * otherwise abort the app silently in release builds, and displays them in
 * a native alert so we can read the actual error message on-device.
 * Remove the handler once the startup crash is diagnosed.
 */
import { Alert } from 'react-native';

let shown = false;
if (global.ErrorUtils) {
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    if (shown) return;
    shown = true;
    const message =
      (error && error.message ? error.message : String(error)) +
      '\n\n' +
      (error && error.stack ? String(error.stack).slice(0, 900) : '');
    try {
      Alert.alert(isFatal ? 'Fatal startup error' : 'JS error', message);
    } catch (e) {
      // nothing else we can do
    }
  });
}

// Register the app through Expo Router. Using require (not import) so the
// error handler above is installed first — ES imports are hoisted.
require('expo-router/entry');
