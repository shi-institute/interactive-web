import { browser } from '$app/environment';
import embeddedFont from '$lib/JetBrains_Mono_Embedded';
import { copy } from '$utils/copy';
import * as Plot from '@observablehq/plot';

interface RenderOptions {
  destroyChildren?: boolean;
}

const defaultRenderOptions: RenderOptions = {
  destroyChildren: true,
};

type PlotNode = ReturnType<typeof Plot.plot>;

class PlotNodeManager {
  private options: Plot.PlotOptions | undefined = undefined;
  private currentNode: PlotNode | undefined = undefined;

  constructor() {
    if (!browser) {
      throw new Error('PlotNode can only be used in the browser');
    }
  }

  setOptions(options: Plot.PlotOptions) {
    this.options = copy(options);

    return this;
  }

  get node() {
    if (this.currentNode === undefined) {
      this.currentNode = this.createNode();
    }
    return this.currentNode;
  }

  private createNode() {
    if (this.options === undefined) {
      throw new Error('plot options are not set');
    }

    const plotNode = Plot.plot(this.options);

    const svgNodes = plotNode.querySelectorAll('svg');
    for (const svgNode of svgNodes) {
      const plotStyleNode = svgNode.querySelector('style');
      if (plotStyleNode)
        plotStyleNode.innerHTML += `
/* we must provide an embedded version of the font so that it can load when the svg
   is inserted into a canvas element (this happens when we save the figure to png
   with html2canvas) */
@font-face {
  font-family: 'JetBrains Mono Embedded';
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url('${embeddedFont}');
}
`;
      if (Array.from(svgNode.classList).some((className) => className.includes('-ramp'))) {
        svgNode.setAttribute('preserveAspectRatio', 'xMinYMid meet');
        svgNode.setAttribute('width', `${parseInt(svgNode.getAttribute('width') || '240') + 20}`);
      }
    }

    return plotNode;
  }

  render(
    node: HTMLElement | undefined | null,
    { destroyChildren }: RenderOptions = defaultRenderOptions
  ) {
    if (node === undefined || node === null) {
      throw new Error('destination node for plot is not defined');
    }

    const plot = this.node;

    if (destroyChildren) {
      node.innerHTML = '';
    }

    node.appendChild(plot);

    return this;
  }
}

export { PlotNodeManager };
export type { PlotNode };
