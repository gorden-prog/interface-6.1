window.ShinMaster = {
	data: {},
	utils: {},
	storage: {},
	state: {},
	ui: {},
	components: {},
	catalog: {},
	cart: {},
	favorites: {},
	pages: {},
	router: {}
};

(function (app) {
	'use strict';

	app.utils.$ = (s, root = document) => root.querySelector(s);

	app.utils.$$ = (s, root = document) => [...root.querySelectorAll(s)];

	app.utils.money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

	app.utils.escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	}[c]));

	app.utils.icon = name => `
		<svg aria-hidden="true">
			<use href="#i-${name}"/>
		</svg>
	`;

	app.utils.size = p => `${p.width}/${p.profile} R${p.diameter}`;

	app.utils.defaultFilters = function defaultFilters() {
		return {
			brands: [],
			seasons: [],
			width: '',
			profile: '',
			diameter: '',
			min: '',
			max: '',
			carType: '',
			available: false,
			q: '',
			sort: 'popular'
		};
	};

	app.utils.options = function options(values, current = '', prefix = '') {
		return `
			<option value="">Все</option>
		` + values.map(value => `
			<option value="${value}" ${String(value) === String(current) ? 'selected' : ''}>${prefix}${value}</option>
		`).join('');
	};

	app.utils.widths = Array.from({ length: 15 }, (_, i) => 175 + i * 10);

	app.utils.profiles = Array.from({ length: 11 }, (_, i) => 30 + i * 5);

	app.utils.diameters = Array.from({ length: 10 }, (_, i) => 13 + i);

	app.utils.mapLink = function mapLink(address) {
		return 'https://yandex.ru/maps/?rtext=~' + encodeURIComponent(address) + '&rtt=auto';
	};

	app.storage.read = (key, fallback) => {
		try {
			return JSON.parse(localStorage.getItem('shin-master:' + key)) ?? fallback;
		} catch {
			return fallback;
		}
	};

	let storageNotice = false;

	app.storage.save = (key, value) => {
		try {
			localStorage.setItem('shin-master:' + key, JSON.stringify(value));
		} catch {
			if (!storageNotice) {
				storageNotice = true;
				app.ui.toast('Хранилище недоступно. Изменения сохранятся только в этой вкладке.');
			}
		}
	};

	app.ui.toast = function toast(message) {
		const el = app.utils.$('#toast');
		el.textContent = message;
		el.classList.add('visible');
		clearTimeout(app.state.toastTimer);
		app.state.toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
	};

	app.ui.updateCounters = function updateCounters() {
		const count = Object.values(app.state.cart).reduce((a, b) => a + b, 0);
		app.utils.$('#cart-count').textContent = count;
		app.utils.$('.cart-icon').setAttribute('aria-label', `Корзина: ${count} шт.`);
		app.utils.$('#favorite-count').textContent = app.state.favorites.size;
		app.utils.$('#favorite-count').hidden = !app.state.favorites.size;
		app.utils.$$('[data-action="theme"]').forEach(b => b.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark'
			? 'Включить светлую тему'
			: 'Включить тёмную тему'));
	};

	app.ui.syncFooterContacts = function syncFooterContacts() {
		const contacts = app.data.contacts;
		app.utils.$('.footer-contacts').innerHTML = `
			<span class="footer-label">НА СВЯЗИ</span>
			<a href="${contacts.tel}">${contacts.phone}</a>
			<a href="mailto:${contacts.email}">${contacts.email}</a>
		`;
		app.utils.$('.footer-locations').innerHTML = contacts.locations.map((location, index) => `
			<div>
				<span class="footer-label">ШИНОМОНТАЖ 0${index + 1}</span>
				<address>${location.address}</address>
				<a class="route-link" href="${app.utils.mapLink(location.address)}" target="_blank" rel="noopener noreferrer" aria-label="Построить маршрут: ${location.address}">Построить маршрут ↗</a>
			</div>
		`).join('');
	};

	app.ui.openPanel = function openPanel(el, trigger) {
		if (!el) return;
		app.state.focusReturn = trigger;
		app.state.activePanel = el;
		app.utils.$('#overlay').hidden = false;
		document.body.classList.add('locked');
		if (el.id === 'filters') {
			el.setAttribute('role', 'dialog');
			el.setAttribute('aria-modal', 'true');
			el.classList.add('open');
		} else {
			el.hidden = false;
			app.utils.$('[data-action="menu"]').setAttribute('aria-expanded', 'true');
		}
		app.utils.$('#main').inert = el.id !== 'filters';
		app.utils.$('#footer').inert = true;
		app.utils.$('.header').inert = true;
		requestAnimationFrame(() => el.querySelector('button,input,select,a')?.focus());
	};

	app.ui.closePanel = function closePanel(restore = true) {
		if (!app.state.activePanel) return;
		const el = app.state.activePanel;
		el.classList.remove('open');
		if (el.id === 'filters') {
			el.removeAttribute('role');
			el.removeAttribute('aria-modal');
		} else el.hidden = true;
		app.utils.$('#overlay').hidden = true;
		document.body.classList.remove('locked');
		app.utils.$('#main').inert = false;
		app.utils.$('#footer').inert = false;
		app.utils.$('.header').inert = false;
		app.utils.$('[data-action="menu"]').setAttribute('aria-expanded', 'false');
		app.state.activePanel = null;
		if (restore && app.state.focusReturn?.isConnected) app.state.focusReturn.focus();
		app.state.focusReturn = null;
	};
})(window.ShinMaster);
