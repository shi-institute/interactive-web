import html2canvas from 'html2canvas';

export async function getElementCanvas(elem: HTMLElement, exportWidth: number, scale = 4) {
  // const mainPageAreaElem = document.querySelector('#pageArea main');
  const mainPageAreaElem = document.querySelector('#pageArea main');
  const pageBackgroundColor =
    mainPageAreaElem &&
    window?.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? getComputedStyle(document.documentElement).backgroundColor
      : 'white';

  // wait 1 second so there is time for the plot to rerender at the export width
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const canvas = await html2canvas(elem, {
    windowWidth: exportWidth,
    backgroundColor: pageBackgroundColor,
    scale,
  });

  return canvas;
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  fileName: string,
  type: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png'
) {
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('download', 'ShiAppliedResearch_' + fileName);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    downloadLink.setAttribute('href', url);
    downloadLink.click();
    URL.revokeObjectURL(url);
  }, type);
}

export async function downloadElement(elem: HTMLElement, exportWidth: number, fileName: string) {
  const canvas = await getElementCanvas(elem, exportWidth);
  await downloadCanvas(canvas, fileName);
}
