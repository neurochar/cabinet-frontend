/* eslint-disable */

import List from '@editorjs/list';

export default class CustomList extends List {
    static get toolbox() {
        const tb = super.toolbox;
        if (Array.isArray(tb)) {
            return tb.filter((item) => item?.data?.style !== 'checklist' && item?.name !== 'Checklist' && item?.title !== 'Checklist');
        }
        return tb;
    }

    render(...args) {
        const el = super.render ? super.render(...args) : document.createElement('div');

        this._onKeyDownShiftEnter = (e) => {
            if (e.key !== 'Enter' || !e.shiftKey) return;

            const sel = window.getSelection?.();
            if (!sel || sel.rangeCount === 0) return;

            const range = sel.getRangeAt(0);
            if (!el.contains(range.commonAncestorContainer)) return;

            e.preventDefault();
            e.stopPropagation();

            try {
                range.deleteContents();
                const br = document.createElement('br');
                range.insertNode(br);
                range.setStartAfter(br);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            } catch {
                try {
                    document.execCommand?.('insertLineBreak');
                } catch (e) {
                    //
                }
            }
        };

        el.addEventListener('keydown', this._onKeyDownShiftEnter, true);
        this._element = el;
        return el;
    }

    destroy() {
        if (this._element && this._onKeyDownShiftEnter) {
            this._element.removeEventListener('keydown', this._onKeyDownShiftEnter, true);
        }
        if (super.destroy) super.destroy();
    }

    renderSettings() {
        const t = [
            {
                label: this.api.i18n.t('Unordered'),
                icon: this.icons?.unordered || '',
                closeOnActivate: true,
                isActive: this.listStyle === 'unordered',
                onActivate: () => {
                    this.listStyle = 'unordered';
                },
            },
            {
                label: this.api.i18n.t('Ordered'),
                icon: this.icons?.ordered || '',
                closeOnActivate: true,
                isActive: this.listStyle === 'ordered',
                onActivate: () => {
                    this.listStyle = 'ordered';
                },
            },
        ];

        if (this.listStyle === 'ordered') {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.value = String(this?.data?.meta?.start ?? 1);
            input.addEventListener('input', (e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v) && v > 0 && typeof this.changeStartWith === 'function') {
                    this.changeStartWith(v);
                }
            });

            const extra = [
                {
                    label: this.api.i18n.t('Start with'),
                    icon: this.icons?.ordered || '',
                    children: {
                        items: [
                            {
                                element: input,
                                type: 'html',
                            },
                        ],
                    },
                },
            ];

            if (Array.isArray(this.defaultCounterTypes) && this.defaultCounterTypes.length > 1) {
                const items = this.defaultCounterTypes.map((type) => ({
                    title: this.api.i18n.t(type),
                    isActive: this?.data?.meta?.counterType === type,
                    closeOnActivate: true,
                    onActivate: () => {
                        if (typeof this.changeCounters === 'function') this.changeCounters(type);
                    },
                }));

                extra.push({
                    label: this.api.i18n.t('Counter type'),
                    icon: this.icons?.ordered || '',
                    children: { items },
                });
            }

            t.push({ type: 'separator' }, ...extra);
        }

        return t;
    }

    normalizeData(data) {
        const normalized = super.normalizeData ? super.normalizeData(data) : data || {};
        if (normalized?.style === 'checklist') {
            normalized.style = 'unordered';

            const fixItems = (items) =>
                (items || []).map((i) => ({
                    ...i,
                    meta: {},
                    items: fixItems(i?.items || []),
                }));

            normalized.items = fixItems(normalized.items || []);
        }
        return normalized;
    }

    static get sanitize() {
        const parent = super.sanitize || {};
        const merge = (x) => (x && typeof x === 'object' ? x : {});

        return {
            ...parent,
            // Когда items — массив строк, это правило применяется к каждой строке
            items: {
                ...merge(parent.items),
                br: true,
            },
            // Когда используется структура с объектами: { content: '...', items: [...] }
            content: {
                ...merge(parent.content),
                br: true,
            },
        };
    }
}
