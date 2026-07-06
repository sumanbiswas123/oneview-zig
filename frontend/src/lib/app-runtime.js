import {
  buildAppPartitionName,
  buildAppSessionStorageKey,
  buildAppStorageKey,
} from "./app-env.js";

export const STORAGE_KEYS = {
  installedApps: buildAppStorageKey("installedApps"),
  notificationHistory: buildAppStorageKey("notificationHistory"),
  ticketSidebarExpanded: buildAppStorageKey("ticketSidebarExpanded.v1"),
  appUpdatesChecked: buildAppSessionStorageKey("app-updates.checked.v1"),
  sharedAppUpdatesChecked: buildAppSessionStorageKey(
    "shared-app-updates.checked.v1",
  ),
  systemUpdateCheckStarted: buildAppSessionStorageKey(
    "system-update.checked.v1",
  ),
  clickTracking: buildAppStorageKey("clickTracking.v1"),
  clickTrackingEndpoint: buildAppStorageKey("clickTracking.endpoint"),
  userRole: buildAppStorageKey("user.role.v1"),
  sharedStorageRegistry: buildAppStorageKey("shared.registry.v1"),
  profileHistory: buildAppStorageKey("profile.history.v1"),
  customBookmarks: buildAppStorageKey("custom.bookmarks.v1"),
  currentProfileId: buildAppStorageKey("currentProfileId"),
  perfEnabled: buildAppStorageKey("perf.enabled"),
  passwordChangeCompletedUsers: buildAppStorageKey(
    "auth.password-change.completed-users.v1",
  ),
  passwordChangePendingUser: buildAppStorageKey(
    "auth.password-change.pending-user.v1",
  ),
  persistedUsername: buildAppStorageKey("auth.persisted.username.v1"),
  persistedPassword: buildAppStorageKey("auth.persisted.password.v1"),
  persistedFirstName: buildAppStorageKey("auth.persisted.first-name.v1"),
  persistedExpiry: buildAppStorageKey("auth.persisted.expiry.v1"),
};

export const SESSION_KEYS = {
  activeLaunchApp: buildAppSessionStorageKey("activeLaunchApp"),
};

export const PARTITIONS = {
  wppproduction: buildAppPartitionName("wppproduction"),
  vml: buildAppPartitionName("vml"),
  gsk: buildAppPartitionName("gsk"),
  guest: buildAppPartitionName("guest"),
  synapse: buildAppPartitionName("synapse"),
  contentgen: buildAppPartitionName("contentgen"),
  runner: buildAppPartitionName("runner"),
};
