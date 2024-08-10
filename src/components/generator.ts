import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';

export abstract class GeneratorElement extends LitElement {

    protected form = createRef<HTMLFormElement>();

    @state()
    protected data: unknown;

    connectedCallback () {

        super.connectedCallback();

        this.classList.add('generator');
    }

    firstUpdated () {

        this.focusForm();
    }

    createRenderRoot () {

        return this;
    }

    async openFile (file: File) {

        const content = await file.text();

        this.data = JSON.parse(content);
    }

    downloadFile () {

        const json = JSON.stringify(this.data, undefined, 2);

        const file = new File([json], 'snippets.json', {
            type: 'application/json',
            lastModified: Date.now(),
        });

        const url = URL.createObjectURL(file);

        const link = document.createElement('a');

        link.href = url;
        link.download = file.name;
        link.style.display = 'none';

        document.body.append(link);

        link.click();

        setTimeout(() => {

            URL.revokeObjectURL(url);
            link.remove();

        }, 0);
    }

    protected focusForm () {

        (this.form.value?.elements[0] as HTMLInputElement)?.focus();
    }
}
