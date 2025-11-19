// hyperlink/index.js
import './Hyperlink.css';
import SelectionUtils from './SelectionUtils';

export default class Hyperlink {
    constructor({ config, api }) {
        this.toolbar = api?.toolbar;
        this.inlineToolbar = api?.inlineToolbar;
        this.tooltip = api?.tooltip;
        this.i18n = api?.i18n ?? { t: (s) => s };
        this.config = config || {};
        this.selection = new SelectionUtils();

        this.commandLink = 'createLink';
        this.commandUnlink = 'unlink';

        this.CSS = {
            wrapper: 'ce-inline-tool-hyperlink-wrapper',
            wrapperShowed: 'ce-inline-tool-hyperlink-wrapper--showed',
            button: 'ce-inline-tool',
            buttonActive: 'ce-inline-tool--active',
            buttonModifier: 'ce-inline-tool--link',
            buttonUnlink: 'ce-inline-tool--unlink',
            input: 'ce-inline-tool-hyperlink--input',
            selectTarget: 'ce-inline-tool-hyperlink--select-target',
            selectRel: 'ce-inline-tool-hyperlink--select-rel',
            buttonSave: 'ce-inline-tool-hyperlink--button',
        };

        this.targetAttributes = this.config.availableTargets || ['_blank', '_self', '_parent', '_top'];

        this.relAttributes = this.config.availableRels || [
            'alternate',
            'author',
            'bookmark',
            'external',
            'help',
            'license',
            'next',
            'nofollow',
            'noreferrer',
            'noopener',
            'prev',
            'search',
            'tag',
        ];

        this.nodes = {
            button: null,
            wrapper: null,
            input: null,
            //onclickInput: null,
            selectTarget: null,
            selectRel: null,
            buttonSave: null,
        };

        this.inputOpened = false;
    }

    render() {
        this.nodes.button = document.createElement('button');
        this.nodes.button.type = 'button';
        this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
        this.nodes.button.appendChild(this.iconSvg('link'));
        return this.nodes.button;
    }

    renderActions() {
        this.nodes.wrapper = document.createElement('div');
        this.nodes.wrapper.classList.add(this.CSS.wrapper);

        // Input
        this.nodes.input = document.createElement('input');
        this.nodes.input.placeholder = 'https://...';
        this.nodes.input.classList.add(this.CSS.input);

        // Onclick
        // this.nodes.onclickInput = document.createElement('input');
        // this.nodes.onclickInput.placeholder = 'JS onClick...';
        // this.nodes.onclickInput.classList.add(this.CSS.input);

        // Target
        this.nodes.selectTarget = document.createElement('select');
        this.nodes.selectTarget.classList.add(this.CSS.selectTarget);
        this.addOption(this.nodes.selectTarget, this.i18n.t('Select target'), '');
        for (let i = 0; i < this.targetAttributes.length; i++) {
            this.addOption(this.nodes.selectTarget, this.targetAttributes[i], this.targetAttributes[i]);
        }

        if (this.config.target) {
            if (this.targetAttributes.length === 0) {
                this.addOption(this.nodes.selectTarget, this.config.target, this.config.target);
            }
            this.nodes.selectTarget.value = this.config.target;
        }

        // Rel
        this.nodes.selectRel = document.createElement('select');
        this.nodes.selectRel.classList.add(this.CSS.selectRel);
        this.addOption(this.nodes.selectRel, this.i18n.t('Select rel'), '');
        for (let i = 0; i < this.relAttributes.length; i++) {
            this.addOption(this.nodes.selectRel, this.relAttributes[i], this.relAttributes[i]);
        }

        if (this.config.rel) {
            if (this.relAttributes.length === 0) {
                this.addOption(this.nodes.selectRel, this.config.rel, this.config.rel);
            }
            this.nodes.selectRel.value = this.config.rel;
        }

        // Button
        this.nodes.buttonSave = document.createElement('button');
        this.nodes.buttonSave.type = 'button';
        this.nodes.buttonSave.classList.add(this.CSS.buttonSave);
        this.nodes.buttonSave.innerHTML = this.i18n.t('Save');
        this.nodes.buttonSave.addEventListener('click', (event) => {
            this.savePressed(event);
        });

        // append
        this.nodes.wrapper.appendChild(this.nodes.input);
        //this.nodes.wrapper.appendChild(this.nodes.onclickInput);

        if (this.targetAttributes?.length) {
            this.nodes.wrapper.appendChild(this.nodes.selectTarget);
        }

        if (this.relAttributes?.length) {
            this.nodes.wrapper.appendChild(this.nodes.selectRel);
        }

        this.nodes.wrapper.appendChild(this.nodes.buttonSave);

        return this.nodes.wrapper;
    }

    surround(range) {
        if (range) {
            if (!this.inputOpened) {
                this.selection.setFakeBackground();
                this.selection.save();
            } else {
                this.selection.restore();
                this.selection.removeFakeBackground();
            }
            const parentAnchor = this.selection.findParentTag('A');
            if (parentAnchor) {
                this.selection.expandToTag(parentAnchor);
                this.unlink();
                this.closeActions();
                this.checkState();
                this.toolbar?.close?.();
                return;
            }
        }
        this.toggleActions();
    }

    get shortcut() {
        return this.config.shortcut || 'CMD+L';
    }

    get title() {
        return 'Hyperlink';
    }

    static get isInline() {
        return true;
    }

    static get sanitize() {
        return {
            a: {
                href: true,
                target: true,
                rel: true,
                //click: true,
            },
        };
    }

    checkState() {
        const anchorTag = this.selection.findParentTag('A');
        if (anchorTag) {
            this.nodes.button.classList.add(this.CSS.buttonUnlink);
            this.nodes.button.classList.add(this.CSS.buttonActive);
            this.openActions();
            const hrefAttr = anchorTag.getAttribute('href');
            //const onclickAttr = anchorTag.getAttribute('click');
            const targetAttr = anchorTag.getAttribute('target');
            const relAttr = anchorTag.getAttribute('rel');
            this.nodes.input.value = hrefAttr ?? '';
            //this.nodes.onclickInput.value = onclickAttr ?? '';
            this.nodes.selectTarget.value = targetAttr ?? '';
            this.nodes.selectRel.value = relAttr ?? '';
            this.selection.save();
        } else {
            this.nodes.button.classList.remove(this.CSS.buttonUnlink);
            this.nodes.button.classList.remove(this.CSS.buttonActive);
        }
        return !!anchorTag;
    }

    clear() {
        this.closeActions();
    }

    toggleActions() {
        if (!this.inputOpened) {
            this.openActions(true);
        } else {
            this.closeActions(false);
        }
    }

    openActions(needFocus = false) {
        this.nodes.wrapper.classList.add(this.CSS.wrapperShowed);
        if (needFocus) {
            this.nodes.input.focus();
        }
        this.inputOpened = true;
    }

    closeActions(clearSavedSelection = true) {
        if (this.selection.isFakeBackgroundEnabled) {
            const currentSelection = new SelectionUtils();
            currentSelection.save();
            this.selection.restore();
            this.selection.removeFakeBackground();
            currentSelection.restore();
        }
        this.nodes.wrapper.classList.remove(this.CSS.wrapperShowed);
        this.nodes.input.value = '';
        //this.nodes.onclickInput.value = '';
        if (this.nodes.selectTarget) this.nodes.selectTarget.value = '';
        if (this.nodes.selectRel) this.nodes.selectRel.value = '';

        if (clearSavedSelection) {
            this.selection.clearSaved();
        }
        this.inputOpened = false;
    }

    savePressed(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        let value = this.nodes.input.value || '';
        //let onclick = this.nodes.onclickInput.value || '';
        let target = this.nodes.selectTarget?.value || '';
        let rel = this.nodes.selectRel?.value || '';

        if (!value.trim()) {
            this.selection.restore();
            this.unlink();
            event.preventDefault();
            this.closeActions();
            return;
        }

        if (this.config.validate === true && !this.validateURL(value)) {
            this.tooltip?.show?.(this.nodes.input, 'The URL is not valid.', {
                placement: 'top',
            });
            setTimeout(() => {
                this.tooltip?.hide?.();
            }, 1000);
            return;
        }

        value = this.prepareLink(value);

        this.selection.restore();
        this.selection.removeFakeBackground();

        this.insertLink(value, target, rel);

        this.selection.collapseToEnd();
        this.inlineToolbar?.close?.();
    }

    validateURL(str) {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4)
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i',
        );
        return !!pattern.test(str);
    }

    prepareLink(link) {
        link = link.trim();
        link = this.addProtocol(link);
        return link;
    }

    addProtocol(link) {
        if (/^(\w+):(\/\/)?/.test(link)) {
            return link;
        }

        const isInternal = /^\/[^/\s]?/.test(link);
        const isAnchor = link.substring(0, 1) === '#';
        const isProtocolRelative = /^\/\/[^/\s]/.test(link);

        if (!isInternal && !isAnchor && !isProtocolRelative) {
            link = 'http://' + link;
        }

        return link;
    }

    insertLink(link, target = '', rel = '', onclick = '') {
        let anchorTag = this.selection.findParentTag('A');
        if (anchorTag) {
            this.selection.expandToTag(anchorTag);
        } else {
            document.execCommand(this.commandLink, false, link);
            anchorTag = this.selection.findParentTag('A');
        }
        if (anchorTag) {
            anchorTag.setAttribute('href', link);

            if (target) {
                anchorTag.target = target;
            } else {
                anchorTag.removeAttribute('target');
            }
            if (rel) {
                anchorTag.rel = rel;
            } else {
                anchorTag.removeAttribute('rel');
            }
            if (onclick) {
                anchorTag.setAttribute('click', onclick);
            } else {
                anchorTag.removeAttribute('click');
            }
        }
    }

    unlink() {
        document.execCommand(this.commandUnlink);
    }

    iconSvg() {
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('width', '24');
        icon.setAttribute('height', '24');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.innerHTML =
            '<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72"></path>';
        return icon;
    }

    addOption(element, text, value = null) {
        const option = document.createElement('option');
        option.text = text;
        option.value = value;
        element.add(option);
    }
}
