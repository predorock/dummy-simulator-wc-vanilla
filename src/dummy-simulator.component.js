/**
 * From
 * https://dev.to/bennypowers/lets-build-web-components-part-3-vanilla-components-4on3#accessible-autonomous-elements
 */

const template = document.createElement("template");
template.innerHTML = `
<style>
  :host {
    display: flex;
  }
  .dummy-simulator-container {
    display: flex;
    flex-direction: column;
  }
</style>
<div class="dummy-simulator-container">
  <div class="input-container">
    <span class="input-label">Your Investment:</span>
    <input id="valueInput" type="number"/>
  </div>
  <div id="result"></div>
</div>`;

export class DummySimulator extends HTMLElement {
  constructor() {
    super();
    this.interestRate = 0.042;
  }

  connectedCallback() {
    var self = this;
    this.updateShadyStyles();
    console.log("my component is connected!");
    if (!self.shadowRoot) {
      self.attachShadow({ mode: "open" });
      self.shadowRoot.appendChild(template.content.cloneNode(true));

      self.shadowRoot
        .getElementById("valueInput")
        .addEventListener("change", function(e) {
          self.renderValue(e.target.value);
        });
      self.shadowDom = self.shadowRoot;
    }
  }

  renderValue(v) {
    var r = this.shadowDom.getElementById("result");
    r.innerHTML = this.getInterestValue(parseFloat(v, 10));
  }

  getInterestValue(v) {
    var value = v + v * this.interestRate;
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR"
    }).format(value);
  }

  updateShadyStyles() {
    window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }
}

DummySimulator.tagName = "dummy-simulator";

window.ShadyCSS &&
  window.ShadyCSS.prepareTemplate(template, DummySimulator.tagName);

if (!customElements.get(DummySimulator.tagName)) {
  customElements.define(DummySimulator.tagName, DummySimulator);
}
