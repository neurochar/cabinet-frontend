import './index.css';
import ToolboxIcon from './svg/toolbox.svg?raw';
import Tunes from './tunes';
import Ui from './ui';
import Uploader from './uploader';

export default class ImageGallery {
    static get isReadOnlySupported() {
        return true;
    }

    static get toolbox() {
        return {
            icon: ToolboxIcon,
            title: 'Gallery',
        };
    }

    constructor({ data, config, api, readOnly }) {
        this.api = api;
        this.readOnly = readOnly;

        this.config = {
            endpoints: config.endpoints || '',
            additionalRequestData: config.additionalRequestData || {},
            additionalRequestHeaders: config.additionalRequestHeaders || {},
            field: config.field || 'image',
            types: config.types || 'image/*',
            buttonContent: config.buttonContent || '',
            uploader: config.uploader || undefined,
            actions: config.actions || undefined,
            maxElementCount: config.maxElementCount || undefined,
            sortableJs: config.sortableJs,
        };

        this.uploader = new Uploader({ config: this.config });
        this.ui = new Ui({
            api,
            config: this.config,
            onSelectFile: () => {
                let maxElementCount = this.config.maxElementCount ? this.config.maxElementCount - this._data.files.length : null;
                this.uploader.uploadSelectedFiles(maxElementCount, {
                    onPreview: (file) => this.ui.getPreloader(file),
                    onUpload: (response, previewElem) => this.onUpload(response, previewElem),
                    onError: (error, previewElem) => this.uploadingFailed(error, previewElem),
                });
            },
            onDeleteFile: (id) => this.deleteImage(id),
            onMoveFile: (oldId, newId) => this.moveImage(oldId, newId),
            readOnly,
        });

        this.tunes = new Tunes({
            api,
            actions: this.config.actions,
            onChange: (styleName) => this.styleToggled(styleName),
        });

        this._data = {};
        this.data = data;
    }

    render() {
        return this.ui.render(this.data);
    }

    rendered() {
        this.checkMaxElemCount();
        return this.ui.onRendered();
    }

    validate(savedData) {
        if (!savedData.files || !savedData.files.length) return false;
        return true;
    }

    save() {
        const caption = this.ui.nodes.caption;
        this._data.caption = caption.value;

        const items = this.ui.nodes.itemsContainer.querySelectorAll(`.${this.ui.CSS.imageContainer}`);
        items.forEach((item, index) => {
            const captionInput = item.querySelector(`.${this.ui.CSS.imageCaption}`);
            if (captionInput && this._data.files[index]) {
                this._data.files[index].caption = captionInput.value;
            }
        });

        return this.data;
    }

    renderSettings() {
        return this.tunes.render(this.data);
    }

    appendImage(file) {
        if (file && file.url) {
            if (this.config.maxElementCount && this._data.files.length >= this.config.maxElementCount) return;
            this._data.files.push(file);
            this.ui.appendImage(file);
            this.checkMaxElemCount();
        }
    }

    moveImage(from, to) {
        if (to >= this._data.files.length) to = this._data.files.length - 1;
        this._data.files.splice(to, 0, this._data.files.splice(from, 1)[0]);
    }

    deleteImage(id) {
        if (this._data.files[id] !== undefined) {
            this._data.files.splice(id, 1);
            this.checkMaxElemCount();
        }
    }

    set data(data) {
        this._data.files = [];
        if (data.files) {
            data.files.forEach((file) => this.appendImage(file));
        }
        this._data.caption = data.caption || '';
        this.ui.fillCaption(this._data.caption);

        let style = data.style || '';
        this.styleToggled(style);
    }

    get data() {
        return this._data;
    }

    onUpload(response, previewElem) {
        this.ui.removePreloader(previewElem);
        if (response.success && response.file) {
            this.appendImage(response.file);
        } else {
            this.uploadingFailed('incorrect response: ' + JSON.stringify(response));
        }
    }

    uploadingFailed(errorText, previewElem) {
        this.ui.removePreloader(previewElem);
        console.log('Image Tool: uploading failed because of', errorText);
        this.api.notifier.show({
            message: this.api.i18n.t('Couldn’t upload image. Please try another.'),
            style: 'error',
        });
    }

    styleToggled(tuneName) {
        if (tuneName === 'fit') {
            this._data.style = 'fit';
        } else {
            this._data.style = 'slider';
        }
    }

    checkMaxElemCount() {
        this.ui.updateLimitCounter(this._data.files.length, this.config.maxElementCount);
        if (this.config.maxElementCount && this._data.files.length >= this.config.maxElementCount) {
            this.ui.hideFileButton();
        } else {
            this.ui.showFileButton();
        }
    }
}
