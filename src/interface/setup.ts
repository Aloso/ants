async function createWebpImage(): Promise<ImageBitmap> {
  if (!window.createImageBitmap) return Promise.reject('createImageBitmap not defined')
  const data = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
  const response = await fetch(data)
  const blob = await response.blob()
  return await createImageBitmap(blob)
}

export async function setup_interface() {
  if (window.innerHeight < window.innerWidth) {
    alert('Dieses Spiel sollte auf einem Handy im Hochformat geöffnet werden.')
  }

  try {
    await createWebpImage()
    document.body.classList.add('supports-webp')
  } catch {
    // do nothing
  }
}
