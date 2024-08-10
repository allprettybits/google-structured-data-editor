import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { PLACEHOLDER, placeholder } from '../templates';
import { dateToISO, dateToInput } from '../utils';
import { GeneratorElement } from './generator';

export const ARTICLE_TYPE = {
    ARTICLE: 'Article',
    NEWS_ARTICLE: 'NewsArticle',
    BLOG_POSTING: 'BlogPosting',
} as const;

export const AUTHOR_TYPE = {
    PERSON: 'Person',
    ORGANIZATION: 'Organization',
} as const;

export type ArticleType = typeof ARTICLE_TYPE[keyof typeof ARTICLE_TYPE];

export type AuthorType = typeof AUTHOR_TYPE[keyof typeof AUTHOR_TYPE];

export interface Article {
    '@context': 'https://schema.org';
    '@type': ArticleType;
    headline: string;
    image: string[];
    datePublished: string;
    dateModified: string;
    author: (Person | Organization)[];
}

export interface Person {
    '@type': 'Person',
    name: string;
    url?: string;
    jobTitle?: string;
}

export interface Organization {
    '@type': 'Organization',
    name: string;
    url?: string;
}

const template = function (this: ArticleGenerator) {

    const data = this.data;
    const download = true;

    return html`
    <div class="preview">
        <div class="item">

            <div class="preview-article">
                <div class="author">
                    ${ placeholder(data.author[0].name, PLACEHOLDER.WORD) }
                </div>
                <div class="headline">
                    ${ placeholder(data.headline, PLACEHOLDER.BLOCK) }
                </div>
                <div class="image">
                    ${ data.image[0]
                        ? html`<img src="${ data.image[0] }" alt="">`
                        : nothing
                    }
                </div>
                <div class="date">
                    ${ placeholder(data.dateModified && new Date(data.dateModified).toLocaleDateString(), PLACEHOLDER.WORD) }
                </div>
            </div>

        </div>
    </div>

    <form ${ ref(this.form) } @submit=${ this.handleSubmit } @reset=${ this.handleReset }>
        <div class="group">
            <div class="fields">
                <label for="headline">Headline</label>
                <input type="text" name="headline" id="headline" autocomplete="off" .value=${ data.headline } required>
                <label for="image">Image</label>
                <textarea name="image" id="image" autocomplete="off" rows="3" required>${ data.image.join('\n') }</textarea>
            </div>
        </div>
        <div class="group">
            <div class="fields">
                <label for="author-type">Author</label>
                <div class="select">
                    <select name="author-type" id="author-type">
                    ${ Object.entries(AUTHOR_TYPE).map(([key, label]) => html`
                        <option .value=${ label } .selected=${ data.author[0]?.['@type'] === label }>${ label }</option>
                    `) }
                    </select>
                    <ui-icon name="chevron"></ui-icon>
                </div>
                <label for="name">Name</label>
                <input type="text" name="name" id="name" autocomplete="off" .value=${ data.author[0]?.name } required>
                <label for="url">URL</label>
                <input type="text" name="url" id="url" autocomplete="off" .value=${ data.author[0]?.url }>
            </div>
        </div>
        <div class="group">
            <div class="fields">
                <label for="published">Date Published</label>
                <input type="datetime-local" name="published" id="published" autocomplete="off" .value=${ dateToInput(data.datePublished) }>
                <label for="modified">Date Modified</label>
                <input type="datetime-local" name="modified" id="modified" autocomplete="off" .value=${ dateToInput(data.dateModified) }>
            </div>
        </div>
        <div class="controls">
            <button type="reset"><ui-icon name="cross"></ui-icon>${ 'Clear' }</button>
            <button type="submit"><ui-icon name="check"></ui-icon>${ 'Update' }</button>
        </div>
    </form>
    `;
};

@customElement('generator-article')
export class ArticleGenerator extends GeneratorElement {

    @state()
    protected data: Article = {
        '@context': 'https://schema.org',
        '@type': ARTICLE_TYPE.ARTICLE,
        headline: '',
        image: [],
        datePublished: '',
        dateModified: '',
        author: [{
            '@type': 'Organization',
            name: '',
            url: ''
        }],
    };

    render () {

        return template.apply(this);
    }

    protected handleSubmit (event: Event) {

        event.preventDefault();
        event.stopPropagation();

        const data = new FormData(this.form.value);

        this.data = {
            ...this.data,
            headline: data.get('headline') as string ?? '',
            image: (data.get('image') as string ?? '').split('\n'),
            author: [
                {
                    "@type": data.get('author-type') as AuthorType,
                    name: data.get('name') as string ?? '',
                    url: data.get('url') as string ?? '',
                },
            ],
            datePublished: data.get('published') ? dateToISO(data.get('published') as string) : '',
            dateModified: data.get('modified') ? dateToISO(data.get('modified') as string) : '',
        };

        this.focusForm();
    }

    protected handleReset (event: Event) {

        this.form.value?.reset();

        this.focusForm();
    }
}
