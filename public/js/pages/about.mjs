const { h, Component } = preact
// Initialize htm with Preact
const html = htm.bind(h)

export class About extends Component {
  render() {
    return html`
      <div class="flex flex-col w-full h-full justify-center items-center p-4">
        <h1 class="text-2xl">About class component (Lazy loading example)</h1>
        <a class="underline" href="/app">Go home</a>
      </div>
    `
  }
}
