window.customElements.define('b2sb-toolbar', class extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.innerHTML = `
            <a href="index.html">Logo</a>
            <div style="flex-grow: 1;"></div>
            <a href="">Lorem</a>
            <a href="">Lorem</a>
            <a href="">Lorem</a>
        `;
    }
});

window.customElements.define('b2sb-footer', class extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.innerHTML = `
            Lorem ipsum dolor sit amet consectetur.
        `;
    }
});