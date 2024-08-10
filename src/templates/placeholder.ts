import { TemplateResult, html } from 'lit';
import { isEmpty } from '../utils';

export const PLACEHOLDER = {
    WORD: 'WORD',
    LINE: 'LINE',
    BLOCK: 'BLOCK',
    IMAGE: 'IMAGE',
} as const;

export type PlaceholderType = keyof typeof PLACEHOLDER;

const PLACEHOLDER_CLASSES: { [key in keyof typeof PLACEHOLDER]: string; } = {
    WORD: 'placeholder-text placeholder-word',
    LINE: 'placeholder-text placeholder-line',
    BLOCK: 'placeholder-text placeholder-block',
    IMAGE: 'placeholder-image',
} as const;

const PLACEHOLDER_TEMPLATES: { [key in keyof typeof PLACEHOLDER]: TemplateResult; } = {
    WORD: html`<span class="${ PLACEHOLDER_CLASSES.WORD }"></span>`,
    LINE: html`<span class="${ PLACEHOLDER_CLASSES.LINE }"></span>`,
    BLOCK: html`<span class="${ PLACEHOLDER_CLASSES.BLOCK }">
        <span class="${ PLACEHOLDER_CLASSES.LINE }"></span>
        <span class="${ PLACEHOLDER_CLASSES.LINE }"></span>
        <span class="${ PLACEHOLDER_CLASSES.LINE }"></span>
    </span>`,
    IMAGE: html`<span class="${ PLACEHOLDER.IMAGE }"></span>`,
} as const;

export const placeholder = (content: string | number | null | undefined, type: PlaceholderType) => isEmpty(content)
    ? PLACEHOLDER_TEMPLATES[type]
    : content;
