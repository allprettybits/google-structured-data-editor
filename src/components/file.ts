import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

export type FileChangeEvent = CustomEvent<{ file: File | undefined; }> & { type: 'file-changed'; };

const template = function (this: FileElement) {

    return html`
    <button part="button" @click=${ this.handleClick }>
        <slot></slot>
    </button>
    ${ this.file
        ? html`<span part="files">${ this.file?.name }</span>`
        : html``
        }
    <input ${ ref(this.input) } type="file" accept="${ this.accept || '' }" @change=${ this.handleChange }>
    `;
};

const styles = css`
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  min-width: 0;
  min-height: 0;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  text-align: inherit;
  vertical-align: inherit;
  white-space: inherit;
  box-sizing: inherit;
}
:host {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
}
span:empty() {
    display: none;
}
input[type=file] {
    display: none;
}
`;

@customElement('file-selector')
export class FileElement extends LitElement {

    static styles = styles;

    protected input = createRef<HTMLInputElement>();

    @state()
    protected file?: File;

    @property({
        attribute: true,
    })
    accept?: string;

    render () {

        return template.apply(this);
    }

    protected handleClick () {

        this.input.value?.click();
    }

    protected handleChange () {

        this.file = this.input.value?.files?.item(0) || undefined;

        this.dispatchEvent(new CustomEvent('file-changed', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                file: this.file,
            },
        }));
    }
}
