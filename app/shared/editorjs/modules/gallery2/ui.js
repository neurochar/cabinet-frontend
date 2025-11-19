/* eslint-disable */

import { IconPicture, IconTrash } from '@codexteam/icons';

export default class Ui {
    constructor({ api, config, onSelectFile, onDeleteFile, onMoveFile, readOnly }) {
        this.api = api;
        this.config = config;
        this.onSelectFile = onSelectFile;
        this.onDeleteFile = onDeleteFile;
        this.onMoveFile = onMoveFile;
        this.readOnly = readOnly;

        this.nodes = {
            wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),
            fileButton: this.createFileButton(),
            container: make('div', this.CSS.container),
            itemsContainer: make('div', this.CSS.itemsContainer),
            controls: make('div', this.CSS.controls),
            preloaderContainer: make('div', this.CSS.preloaderContainer),
            caption: make('input', [this.CSS.input, this.CSS.caption], {
                placeholder: this.api.i18n.t('Gallery caption'),
                disabled: this.readOnly,
            }),
        };

        if (!this.readOnly) {
            this.nodes.controls.appendChild(this.nodes.preloaderContainer);
            if (this.config.maxElementCount) {
                this.nodes.limitCounter = make('div', this.CSS.limitCounter);
                this.nodes.controls.appendChild(this.nodes.limitCounter);
            }
            this.nodes.controls.appendChild(this.nodes.fileButton);
        }

        this.nodes.container.appendChild(this.nodes.itemsContainer);
        if (!this.readOnly) {
            this.nodes.container.appendChild(this.nodes.controls);
        }

        // Caption теперь в самом низу
        this.nodes.wrapper.appendChild(this.nodes.container);
        if (!this.readOnly) {
            //this.nodes.wrapper.appendChild(this.nodes.caption);
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
            this.nodes.itemsContainer.addEventListener(
                eventName,
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                },
                false,
            );
        });
    }

    get CSS() {
        return {
            baseClass: this.api.styles.block,
            loading: this.api.styles.loader,
            input: this.api.styles.input,
            button: this.api.styles.button,

            wrapper: 'image-gallery',
            container: 'image-gallery__container',
            controls: 'image-gallery__controls',
            limitCounter: 'image-gallery__counter',
            itemsContainer: 'image-gallery__items',
            imageContainer: 'image-gallery__image',
            preloaderContainer: 'image-gallery__preloaders',
            imagePreloader: 'image-gallery__preloader',
            imageEl: 'image-gallery__image-picture',
            trashButton: 'image-gallery__image-trash',
            caption: 'image-gallery__caption',
            imageCaption: 'image-gallery__image-caption',
        };
    }

    static get status() {
        return {
            EMPTY: 'empty',
            UPLOADING: 'loading',
            FILLED: 'filled',
        };
    }

    render(toolData) {
        return this.nodes.wrapper;
    }

    onRendered() {
        if (!this.readOnly && !this.sortable) {
            this.sortable = new this.config.sortableJs(this.nodes.itemsContainer, {
                handle: `.${this.CSS.imageContainer}`,
                filter: `.${this.CSS.trashButton}`,
                onStart: () => {
                    this.nodes.itemsContainer.classList.add(`${this.CSS.itemsContainer}--drag`);
                },
                onEnd: (evt) => {
                    this.nodes.itemsContainer.classList.remove(`${this.CSS.itemsContainer}--drag`);
                    if (evt.oldIndex !== evt.newIndex) {
                        this.onMoveFile(evt.oldIndex, evt.newIndex);
                    }
                },
            });
            this.nodes.itemsContainer.classList.add('sortable');
        }
    }

    createFileButton() {
        const button = make('div', [this.CSS.button]);
        button.innerHTML = this.config.buttonContent || `${IconPicture} ${this.api.i18n.t('Select an Image')}`;
        button.addEventListener('click', () => this.onSelectFile());
        return button;
    }

    showFileButton() {
        this.nodes.fileButton.style.display = '';
    }

    hideFileButton() {
        this.nodes.fileButton.style.display = 'none';
    }

    getPreloader(file) {
        let preloader = make('div', this.CSS.imagePreloader);
        this.nodes.preloaderContainer.append(preloader);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            preloader.style.backgroundImage = `url(${e.target.result})`;
        };
        return preloader;
    }

    removePreloader(preloader) {
        preloader.remove();
    }

    appendImage(file) {
        let url = file.url;
        const tag = /\.mp4$/.test(url) ? 'VIDEO' : 'IMG';
        const attributes = { src: url };

        let eventName = 'load';
        if (tag === 'VIDEO') {
            attributes.autoplay = false;
            attributes.muted = true;
            attributes.playsinline = true;
            eventName = 'loadeddata';
        }

        let imageContainer = make('div', [this.CSS.imageContainer]);
        let imageEl = make(tag, this.CSS.imageEl, attributes);

        imageEl.addEventListener(eventName, () => {
            this.toggleStatus(imageContainer, Ui.status.FILLED);
        });

        imageContainer.appendChild(imageEl);

        const imageCaption = make('input', [this.CSS.imageCaption], {
            placeholder: 'Введите подпись к изображению',
            value: file.caption || '',
            disabled: this.readOnly,
        });

        imageContainer.appendChild(imageCaption);

        const title = this.api.i18n.t('Delete');
        if (!this.readOnly) {
            let imageTrash = make('div', [this.CSS.trashButton], {
                innerHTML: IconTrash,
                title,
            });
            this.api.tooltip.onHover(imageTrash, title, { placement: 'top' });
            imageTrash.addEventListener('click', () => {
                this.api.tooltip.hide();
                let arrayChild = Array.prototype.slice.call(this.nodes.itemsContainer.children);
                let elIndex = arrayChild.indexOf(imageContainer);
                if (elIndex !== -1) {
                    this.nodes.itemsContainer.removeChild(imageContainer);
                    this.onDeleteFile(elIndex);
                }
            });
            imageContainer.appendChild(imageTrash);
        }

        this.nodes.itemsContainer.append(imageContainer);
    }

    fillCaption(text) {
        if (this.nodes.caption) {
            this.nodes.caption.value = text;
        }
    }

    toggleStatus(elem, status) {
        for (const statusType in Ui.status) {
            elem.classList.toggle(`${this.CSS.imageContainer}--${Ui.status[statusType]}`, status === Ui.status[statusType]);
        }
    }

    updateLimitCounter(imageCount, limitCounter) {
        if (limitCounter && this.nodes.limitCounter) {
            this.nodes.limitCounter.style.display = imageCount === 0 ? 'none' : null;
            this.nodes.limitCounter.innerText = `${imageCount} / ${limitCounter}`;
        }
    }
}

export const make = function make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);
    if (Array.isArray(classNames)) el.classList.add(...classNames);
    else if (classNames) el.classList.add(classNames);
    for (const attrName in attributes) el[attrName] = attributes[attrName];
    return el;
};
