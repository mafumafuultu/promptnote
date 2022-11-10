const onload = () => document.readyState !== 'complete'
	? new Promise(r => document.addEventListener('readystatechange', () => {switch (document.readyState) {case 'complete': r();break;default:}	}))
	: Promise.resolve();

const ymldir = a => a.map(v => `./notes/${v}`);
const myItems = ymldir([
	'preset.yml',
	'base.yml',
]);
const mix = a => Object.assign(...a);
const DOC = {
	ID: id => document.getElementById(id),
	Q: q => document.querySelectorAll(q),
};
const loadYaml = async url => fetch(url).then(v => v.text()).then(v => jsyaml.load(v));
const loadItems = () => Promise.all(myItems.map(loadYaml)).then(mix);

const TAG = n => document.createElement(n);
const details = (key, items) => {
    let dl = TAG('details');
    dl.append(summary(key));
    dl.append(...Object.entries(items).map(mappingElem));
    return dl;
};

const summary = v => {
    let el = TAG('summary');
    el.textContent = v;
    return el;
};

const mappingElem = ([en, jp] = v) => typeof jp === 'object'?details(en, jp) :labeledCBox(en, jp);
const labeledCBox = (en, jp) => {
    let cx = TAG('input');
    cx.type = 'checkbox';
    cx.dataset.en = en;
    cx.dataset.jp = jp;
    let label = TAG('label');
    label.textContent = jp;
    label.append(cx);
    return label;
};
const toAcc = o => Object.entries(o).map(mappingElem);