const ymldir = a => a.map(v => `./notes/${v}`);
const myItems = ymldir([
	'preset.yml',
	'base.yml',
]);

const mix = a => Object.assign(...a);
const enableVal = v => v != null && v != '';
const DOC = {
	ID: id => document.getElementById(id),
	Q: q => document.querySelectorAll(q),
};
const TAG = n => document.createElement(n);

const onload = () => document.readyState !== 'complete'
	? new Promise(r => document.addEventListener('readystatechange', () => {switch (document.readyState) {case 'complete': r();break;default:}  }))
	: Promise.resolve();

const loadYaml = async url => fetch(url).then(v => v.text()).then(v => jsyaml.load(v));
const loadItems = () => Promise.all(myItems.map(loadYaml)).then(mix);


/* generate items */
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
}

const toAcc = o => Object.entries(o).map(mappingElem);

/* for view events */
const promptCount = s => s === '' ? 0 : s.replaceAll(/[^,]+/g, '').length + 1;
const upText = (positive, negative) => {
	DOC.ID('positive').value = positive;
	DOC.ID('negative').value = negative;
	DOC.ID('poscnt').innerText = promptCount(positive);
	DOC.ID('negcnt').innerText = promptCount(negative);
};

function checkdBox() {
	let checked = [...document.forms['accs'].querySelectorAll(':checked')];
	let pos = checked.map(v => v.dataset.positive).filter(enableVal).join(', '),
		neg = checked.map(v => v.dataset.negative).filter(enableVal).join(', ');
	Fn.updateInfo(pos, neg);
};

const toHide = nodes => nodes.forEach(v => v.classList.add('hide'));
const toShow = nodes => nodes.forEach(v => v.classList.remove('hide'));
const hideNotContains = () => [...DOC.Q('details')].reverse().forEach(v => v.querySelector('label:not([class~=hide])') ? v.classList.remove('hide') : v.classList.add('hide'));

const searchItems = (labeltxt, postxt, negtxt) => {
	let lb = enableVal(labeltxt) ? `[data-jp*=${labeltxt}]` : '',
		ps = enableVal(postxt) ? `[data-positive*=${postxt}]` : '',
		ng = enableVal(negtxt) ? `[data-negative*=${negtxt}]` : '',
		total = `${lb}${ps}${ng}`;

	if (!enableVal(total)) {
		toShow(DOC.Q('label.hide, details.hide'));
	} else {
		toHide(DOC.Q('label:has(input)'));
		toShow(DOC.Q(`label:has(input${total})`));
		hideNotContains();
	}
};


class Fn {
	static open() {
		DOC.Q('details').forEach(v => v.setAttribute('open', true));
	}
	static close() {
		DOC.Q('details').forEach(v => v.removeAttribute('open'));
	}
	static search() {
		searchItems(...[...document.forms['searches'].querySelectorAll('input')].map(v => v.value));
	}
	static updateInfo(positive, negative) {
		DOC.ID('positive').value = positive;
		DOC.ID('negative').value = negative;
		DOC.ID('poscnt').innerText = promptCount(positive);
		DOC.ID('negcnt').innerText = promptCount(negative);
	}
	static clear() {
		let checked = [...document.forms['accs'].querySelectorAll(':checked')].forEach(v => v.checked = false);
		Fn.updateInfo('', '');
	}
	static toggleLabel(e) {
		switch(e.target.tagName) {
			case 'INPUT':
			case 'LABEL':
				checkdBox();
				break;
			default:
		}
	}
}