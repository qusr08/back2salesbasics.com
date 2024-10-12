window.customElements.define('b2sb-toolbar', class extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.innerHTML = `
            
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