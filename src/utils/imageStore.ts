let currentImageUri: string | null = null;

export function setCurrentImageUri(uri: string) {
  currentImageUri = uri;
}

export function getCurrentImageUri(): string | null {
  return currentImageUri;
}