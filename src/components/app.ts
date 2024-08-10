import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import type { FileChangeEvent } from './file';
import type { GeneratorElement } from './generator';

import './article';
import './faq';
import './file';
import './icon';

const GENERATORS = {
    Article: (app: AppElement) => html`<generator-article ${ ref(app.generatorElement) }></generator-article>`,
    FAQ: (app: AppElement) => html`<generator-faq ${ ref(app.generatorElement) }></generator-faq>`,
} as const;

export type GeneratorType = keyof typeof GENERATORS;

const template = function (this: AppElement) {

    return html`
    <header>
        <div class="select">
            <select @change=${ (event: Event) => this.handleGeneratorChanged(event) }>
            ${ Object.keys(GENERATORS).map(key => html`
                <option .value=${ key } .selected=${ key === this.generator }>${ key }</option>
            `) }
            </select>
            <ui-icon name="chevron"></ui-icon>
        </div>
        <file-selector accept="application/json" @file-changed=${ this.handleFileChanged }>
            <ui-icon name="folder"></ui-icon>Open File
        </file-selector>
        <button ?disabled=${ (this.generatorElement.value as any)?.canDownload } @click=${ this.handleDownload }><ui-icon name="disk"></ui-icon>Save File</button>
    </header>

    ${ GENERATORS[this.generator](this) }
    `;
}

@customElement('generator-app')
export class AppElement extends LitElement {

    @state()
    protected generator: GeneratorType = 'Article';

    generatorElement = createRef<GeneratorElement>();

    createRenderRoot () {

        return this;
    }

    render () {

        return template.apply(this);
    }

    protected handleGeneratorChanged (event: Event) {

        const select = event.target as HTMLSelectElement;

        this.generator = select.options[select.selectedIndex].value as GeneratorType;
    }

    protected handleFileChanged (event: FileChangeEvent) {

        if (!event.detail.file) return;

        void this.generatorElement.value?.openFile(event.detail.file);
    }

    protected handleDownload () {

        this.generatorElement.value?.downloadFile();
    }
}
