import cytoscape from 'cytoscape';
import puppeteer from 'puppeteer';
import { keys, map, assign, flatten } from './utils';

const baseOpts = {
  style: `
    node[label != '$initial'] {
      content: data(label);
      text-valign: center;
      text-halign: center;
      shape: roundrectangle;
      width: label;
      height: label;
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 5px;
      padding-bottom: 5px;
      background-color: white;
      border-width: 1px;
      border-color: black;
      font-size: 10px;
      font-family: Helvetica Neue;
    }
    node:active {
      overlay-color: black;
      overlay-padding: 0;
      overlay-opacity: 0.1;
    }
    .foo {
      background-color: blue;
    }
    node[label = '$initial'] {
      visibility: hidden;
    }
    $node > node {
      padding-top: 1px;
      padding-left: 10px;
      padding-bottom: 10px;
      padding-right: 10px;
      text-valign: top;
      text-halign: center;
      border-width: 1px;
      border-color: black;
      background-color: white;
    }
    edge {
      curve-style: bezier;
      width: 1px;
      target-arrow-shape: triangle;
      label: data(label);
      font-size: 5px;
      font-weight: bold;
      text-background-color: #fff;
      text-background-padding: 3px;
      line-color: black;
      target-arrow-color: black;
      z-index: 100;
      text-wrap: wrap;
      text-background-color: white;
      text-background-opacity: 1;
      target-distance-from-node: 2px;
    }
    edge[label = ''] {
      source-arrow-shape: circle;
      source-arrow-color: black;
    }
  `,
  layout: {
    name: 'cose',
    randomize: true,
    idealEdgeLength: 70,
    animate: false
  }
};

const html = `
<!doctype html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.1.4/cytoscape.min.js"></script>
    <style>
      html body { margin: 0; padding: 0; }
      #cy { position: absolute; left: 0; right: 0; top: 0; bottom: 0; }
    </style>
  </head>
  <body>
    <div id="cy"></div>
  </body>
</html>
`;

const getOptsForState = state => {
  const nodes = map(keys(state.states), k => ({
    data: {
      id: `machine.${k}`,
      label: k,
      parent: 'machine'
    }
  })).concat([
    { data: { id: 'machine.$initial', label: '$initial', parent: 'machine' } }
  ]);
  const edges = flatten(
    map(keys(state.states), k =>
      map(keys(state.states[k]), v => ({
        data: {
          id: `${k}:${state.states[k][v]}`,
          source: `machine.${k}`,
          target: `machine.${state.states[k][v]}`,
          label: v
        }
      }))
    )
  ).concat([
    {
      data: {
        id: `$initial:${state.initial}`,
        source: 'machine.$initial',
        target: `machine.${state.initial}`,
        label: ''
      }
    }
  ]);
  return {
    elements: {
      nodes,
      edges
    }
  };
};

export default async function stateChart(state) {
  const opts = assign({}, baseOpts, getOptsForState(state));
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });
  await page.setContent(html);
  await page.waitForFunction(() => typeof window.cytoscape === 'function');
  await page.evaluate(cytoOpts => {
    cytoOpts.container = document.getElementById('cy');
    window.cytoscape(cytoOpts);
  }, opts);
  const png = await page.screenshot({ type: 'png', omitBackground: true });
  const pdf = await page.pdf();
  await browser.close();
  return {
    png,
    pdf,
    json: cytoscape(opts).json()
  };
}
