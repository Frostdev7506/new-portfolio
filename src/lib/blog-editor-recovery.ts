export function removeMatchingRecovery(
  storage: Pick<Storage, "getItem" | "removeItem">,
  key: string,
  expected: string | null,
): void {
  // Another tab may have replaced this editor's recovery copy.
  if (expected !== null && storage.getItem(key) === expected) storage.removeItem(key);
}
