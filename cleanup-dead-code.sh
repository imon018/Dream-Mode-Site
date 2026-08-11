#!/bin/bash
# Run this from the project root (Dream-Mode-Site-main).
# Deletes 62 files across src/core, src/devops, src/mobile,
# src/analytics, src/courier, src/security that are never
# imported anywhere in the codebase (verified with grep).
set -e

FILES=(
  "src/analytics/cartAnalytics.js"
  "src/analytics/eventTracker.js"
  "src/analytics/heatmap.js"
  "src/analytics/retention.js"
  "src/analytics/revenueTracker.js"
  "src/analytics/salesAnalytics.js"
  "src/analytics/userFlow.js"
  "src/core/apiClient.js"
  "src/core/appFinalizer.js"
  "src/core/buildAnalyzer.js"
  "src/core/cacheManager.js"
  "src/core/configManager.js"
  "src/core/debugMode.js"
  "src/core/errorHandler.js"
  "src/core/eventBus.js"
  "src/core/featureManager.js"
  "src/core/globalState.js"
  "src/core/moduleLoader.js"
  "src/core/pluginRegistry.js"
  "src/core/pluginSystem.js"
  "src/core/routerGuard.js"
  "src/core/securityCore.js"
  "src/core/stateHydrator.js"
  "src/core/systemMonitor.js"
  "src/courier/addressValidator.js"
  "src/courier/codHandler.js"
  "src/courier/courierSelector.js"
  "src/courier/deliveryCalculator.js"
  "src/courier/estimatedDelivery.js"
  "src/courier/invoiceGenerator.js"
  "src/courier/orderTrackingAPI.js"
  "src/courier/returnHandler.js"
  "src/courier/shippingZones.js"
  "src/courier/statusUpdater.js"
  "src/devops/buildChecker.js"
  "src/devops/ciPipeline.js"
  "src/devops/deployHelper.js"
  "src/devops/deployStatus.js"
  "src/devops/featureFlags.js"
  "src/devops/healthCheck.js"
  "src/devops/logUploader.js"
  "src/devops/rollbackSystem.js"
  "src/devops/versionManager.js"
  "src/mobile/appShell.js"
  "src/mobile/batterySaver.js"
  "src/mobile/gestureControl.js"
  "src/mobile/mobileNav.js"
  "src/mobile/pushNotifications.js"
  "src/mobile/pwaConfig.js"
  "src/mobile/responsiveFix.js"
  "src/mobile/speedBoost.js"
  "src/mobile/touchOptimizer.js"
  "src/security/authGuard.js"
  "src/security/deviceFingerprint.js"
  "src/security/firebaseRules.js"
  "src/security/inputSanitizer.js"
  "src/security/rateLimiter.js"
  "src/security/roleGuard.js"
  "src/security/secureStorage.js"
  "src/security/securityLogger.js"
  "src/security/sessionValidator.js"
  "src/security/tokenManager.js"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    rm "$f"
    echo "deleted: $f"
  else
    echo "skip (not found): $f"
  fi
done

# Remove now-empty folders
for d in src/core src/devops src/mobile src/analytics src/courier src/security; do
  if [ -d "$d" ] && [ -z "$(ls -A "$d")" ]; then
    rmdir "$d"
    echo "removed empty folder: $d"
  fi
done

echo "Done. Review 'git status' / 'git diff' before committing."
