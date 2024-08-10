import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const template = function (this: IconElement) {

    return html`<svg focusable="false" aria-hidden="true"><use href="${ this.sprite }#${ this.name }"/></svg>`;
};

@customElement('ui-icon')
export class IconElement extends LitElement {

    @property({ attribute: true })
    name = '';

    @property({ attribute: true })
    sprite = '/assets/icons.svg';

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }
}
