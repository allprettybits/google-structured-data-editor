import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

export interface FAQPage {
    '@context': 'https://schema.org';
    '@type': 'FAQPage';
    mainEntity: Question[];
}

export interface Question {
    '@type': 'Question';
    name: string;
    acceptedAnswer: Answer;
}

export interface Answer {
    '@type': 'Answer',
    text: string;
}

const QUESTION: Question = {
    '@type': 'Question',
    name: '',
    acceptedAnswer: {
        '@type': 'Answer',
        text: '',
    },
};

const template = function (this: FAQGenerator) {

    const item = this.data.mainEntity[this.index];
    const download = !item && this.data.mainEntity.length > 0;

    return html`
        ${ this.data.mainEntity.map((question, index) => html`
        <div class="item">
            <div class="question">${ question.name }</div>
            <div class="answer">${ question.acceptedAnswer.text }</div>
            <button @click=${ ()=> this.editItem(index) }>Edit</button>
            <button @click=${ ()=> this.deleteItem(index) }>Delete</button>
        </div>
        `) }

        <form ${ ref(this.form) } @submit=${ this.handleSubmit } @reset=${ this.handleReset }>
            <div>
                <label for="question">Question</label>
                <input type="text" name="question" id="question" value=${ item?.name ?? '' } required>
            </div>
            <div>
                <label for="answer">Answer</label>
                <input type="text" name="answer" id="answer" value=${ item?.acceptedAnswer.text ?? '' } required>
            </div>
            <button type="submit">${ item ? 'Update' : 'Add' }</button>
            <button type="reset">${ item ? 'Cancel' : 'Clear' }</button>
            ${ download ? html`<button type="button" @click=${ this.handleDownload }>Download</button>` : '' }
        </form>
    `;
};

@customElement('faq-generator')
export class FAQGenerator extends LitElement {

    protected form = createRef<HTMLFormElement>();

    @state()
    protected data: FAQPage = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [],
    };

    @state()
    protected index = 0;

    firstUpdated () {

        this.focusForm();
    }

    createRenderRoot () {

        return this;
    }

    render () {

        return template.apply(this);
    }

    protected handleSubmit (event: Event) {

        event.preventDefault();
        event.stopPropagation();

        const data = new FormData(this.form.value);

        const question: Question = {
            ...QUESTION,
            name: data.get('question') as string ?? '',
            acceptedAnswer: {
                ...QUESTION.acceptedAnswer,
                text: data.get('answer') as string ?? '',
            },
        };

        if (this.data.mainEntity[this.index]) {

            this.data.mainEntity.splice(this.index, 1, question);

        } else {

            this.data.mainEntity.push(question);
        }

        this.form.value?.reset();

        this.data = { ...this.data };

        this.index = this.data.mainEntity.length;

        this.focusForm();
    }

    protected handleReset (event: Event) {

        this.index = this.data.mainEntity.length;

        this.focusForm();
    }

    handleDownload (event: Event) {

        const json = JSON.stringify(this.data, undefined, 2);

        const file = new File([json], 'snippet.json', {
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

    protected editItem (index: number) {

        this.index = index;

        this.focusForm();
    }

    protected deleteItem (index: number) {

        this.data.mainEntity.splice(index, 1);

        this.data = { ...this.data };

        this.index = this.data.mainEntity.length;

        this.focusForm();
    }

    protected focusForm () {

        (this.form.value?.elements[0] as HTMLInputElement)?.focus();
    }
}
