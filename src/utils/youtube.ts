export function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  
  // Match standard youtube.com, youtu.be, and shorts URLs
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }
  
  return null;
}

export function isYouTubeUrl(url: string | undefined): boolean {
  return getYouTubeId(url) !== null;
}
