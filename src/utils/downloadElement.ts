import html2canvas from 'html2canvas';

export async function downloadElement(elem: HTMLElement, exportWidth: number, fileName: string) {
  const mainPageAreaElem = document.querySelector('#pageArea main');
  const pageBackgroundColor = mainPageAreaElem
    ? getComputedStyle(mainPageAreaElem).backgroundColor
    : 'white';

  // wait 1 second so there is time for the plot to rerender at the export width
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const canvas = await html2canvas(elem, {
    windowWidth: exportWidth,
    backgroundColor: pageBackgroundColor,
    scale: 4,
  });

  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('download', 'ShiAppliedResearch_' + fileName);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    downloadLink.setAttribute('href', url);
    downloadLink.click();
    URL.revokeObjectURL(url);
  });
}
