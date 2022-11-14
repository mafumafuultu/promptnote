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

const mappingElem = ([jp, en] = v) => en instanceof Array ? labeledCBox2(jp, en) : typeof en === 'object' ? details(jp, en) : labeledCBox(jp, en);
const labeledCBox = (jp, en) => {
    let cx = TAG('input');
    cx.type = 'checkbox';
    cx.dataset.jp = jp;
    cx.dataset.positive = en;
    cx.dataset.negative = "";
    let label = TAG('label');
    label.textContent = jp;
    label.append(cx);
    return label;
};
const labeledCBox2 = (jp, en) => {
    let cx = TAG('input');
    cx.type = 'checkbox';
    cx.dataset.jp = jp;
    cx.dataset.positive = en[0].trim();
    cx.dataset.negative = en[1] == null ? "" : en[1].trim();
    let label = TAG('label');
    label.textContent = jp;
    label.append(cx);
    return label;
};
const toAcc = o => Object.entries(o).map(mappingElem);