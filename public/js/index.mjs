import { LoadingComponent } from "./components/Loading/index.mjs"
import { Error } from "./pages/error.mjs"

const { h, Component, render } = preact
const { Router } = preactRouter
const AsyncRoute = window["preact-async-route"]
// Initialize htm with Preact
const html = htm.bind(h)

const About = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      import("./pages/about.mjs").then((module) => resolve(module.About))
    }, 2000)
  })

/** Stateless app */
const App = () =>
  html`<${Router}>
      <${Home} path="/app" />
      <${AsyncRoute} path="/app/about" getComponent=${About}
    loading=${() => html`<${LoadingComponent} />`} />
      <${Error} type="/app/404" default />
    </${Router}>`

/** our index route */
class Home extends Component {
  setText = (e) => {
    this.setState({ text: e.target.value })
  }
  render({}, { text = "Some Text" }) {
    return html`<section class="flex flex-col items-center px-2 py-4 space-y-3">
      <p class="text-2xl">Home Class Component</p>
      <input
        class="dark:bg-transparent dark:text-white border border-gray-400 px-2 py-1 rounded-md"
        value=${text}
        onInput=${this.setText}
      />
      <div>In caps: ${text.toUpperCase()}</div>
      <br />
      <a class="underline" href="/app/asdf">Error router</a>
      <a class="underline" href="/app/about">About page</a>
      <button
        class="dark:bg-white text-slate-700 bg-green-300 px-2 py-1 rounded-md"
        onclick=${() => {
          const htmlTag = document.children[0]
          const mode = htmlTag.classList.contains("dark") ? "light" : "dark"
          htmlTag.className = mode
        }}
      >
        toggle dark mode
      </button>
    </section>`
  }
}

render(html`<${App} />`, document.getElementById("app-root"))
