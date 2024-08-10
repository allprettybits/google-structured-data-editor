import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { PLACEHOLDER, placeholder } from '../templates';
import { GeneratorElement } from './generator';

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

    const data = this.data;
    const item = this.data.mainEntity[this.index];
    const count = this.data.mainEntity.length;
    const download = !item && count > 0;

    return html`
    <div class="preview">
        <div class="item">

            ${ !data.mainEntity.length
                ? html`
                <div class="preview-faq">
                    <div class="question">${ placeholder('', PLACEHOLDER.LINE) }<ui-icon name="chevron"></ui-icon></div>
                    <div class="answer">${ placeholder('', PLACEHOLDER.BLOCK) }</div>
                </div>
                `
                : nothing
            }

            ${ this.data.mainEntity.map((question, index) => html`
                <div class="preview-faq">
                    <div class="question">${ question.name }<ui-icon name="chevron"></ui-icon></div>
                    <div class="answer">${ question.acceptedAnswer.text }</div>
                    <div class="controls">
                        <button title="Edit" @click=${ () => this.editItem(index) }><ui-icon name="pen"></ui-icon></button>
                        <button title="Delete" @click=${ () => this.deleteItem(index) }><ui-icon name="trash"></ui-icon></button>
                    </div>
                </div>
            `) }

        </div>
    </div>

    <form ${ ref(this.form) } @submit=${ this.handleSubmit } @reset=${ this.handleReset }>
        <div class="fields">
            <label for="question">Question</label>
            <input type="text" name="question" id="question" autocomplete="off" value=${ item?.name ?? '' } required>
            <label for="answer">Answer</label>
            <textarea name="answer" id="answer" autocomplete="off" rows="3"
                required>${ item?.acceptedAnswer.text ?? '' }</textarea>
        </div>
        <div class="controls">
            <button type="reset"><ui-icon name="cross"></ui-icon>${ item ? 'Cancel' : 'Clear' }</button>
            <button type="submit"><ui-icon name="${ item ? 'check' : 'plus' }"></ui-icon>${ item ? 'Update' : 'Add' }</button>
        </div>
    </form>
    `;
};

@customElement('generator-faq')
export class FAQGenerator extends GeneratorElement {

    @state()
    protected data: FAQPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [],
    };

    @state()
    protected index = 0;

    render () {

        return template.apply(this);
    }

    async openFile (file: File): Promise<void> {

        await super.openFile(file);

        this.index = this.data.mainEntity.length;
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
}
