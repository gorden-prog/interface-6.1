(function (app) {
	'use strict';

	const rawCart = app.storage.read('cart', {});

	app.state.cart = Object.fromEntries(Object.entries(rawCart && typeof rawCart === 'object' ? rawCart : {}).filter(([id, q]) => app.data.products.some(p => p.id === id && p.available) && Number.isInteger(q)
		&& q > 0 && q <= 99));

	const rawFavorites = app.storage.read('favorites', []);

	app.state.favorites = new Set((Array.isArray(rawFavorites) ? rawFavorites : []).filter(id => app.data.products.some(p => p.id === id)));

	const initialTheme = app.storage.read('theme', 'dark');

	document.documentElement.dataset.theme = initialTheme === 'light' ? 'light' : 'dark';

	app.state.filterState = app.utils.defaultFilters();

	app.state.currentRoute = '';

	app.state.homeSeason = '';

	app.state.activePanel = null;

	app.state.focusReturn = null;

	app.state.orderComplete = false;

	app.catalog.filterProducts = function filteredProducts(state = app.state.filterState) {
		const query = state.q.toLowerCase().replace(/\s/g, '');
		const result = app.data.products.filter(product => {
			if (state.brands.length && !state.brands.includes(product.brand)) return false;
			if (state.seasons.length && !state.seasons.includes(product.season)) return false;
			if (state.width && product.width !== Number(state.width)) return false;
			if (state.profile && product.profile !== Number(state.profile)) return false;
			if (state.diameter && product.diameter !== Number(state.diameter)) return false;
			if (state.min && product.price < Number(state.min)) return false;
			if (state.max && product.price > Number(state.max)) return false;
			if (state.carType && product.carType !== state.carType) return false;
			if (state.available && !product.available) return false;

			const name = `${product.brand} ${product.model} ${app.utils.size(product)}`;
			return !query || name.toLowerCase().replace(/\s/g, '').includes(query);
		});

		return result.sort((first, second) => {
			switch (state.sort) {
				case 'price-asc':
					return first.price - second.price;
				case 'price-desc':
					return second.price - first.price;
				case 'name': {
					const firstName = `${first.brand} ${first.model}`;
					const secondName = `${second.brand} ${second.model}`;
					return firstName.localeCompare(secondName, 'ru');
				}
				default:
					return Number(second.popular) - Number(first.popular);
			}
		});
	};

	app.catalog.renderResults = function renderResults() {
		const list = app.catalog.filterProducts();
		app.utils.$('#result-count').textContent = `Найдено моделей: ${list.length}`;
		app.utils.$('#catalog-grid').innerHTML = list.length
			? list.map(app.components.productCard).join('')
			: app.components.emptyState('Ничего не найдено', 'Попробуйте другой размер или уберите часть фильтров.', 'Сбросить фильтры',
			'reset');
		app.utils.$('#query-label').innerHTML = app.state.filterState.q
			? `
			<div class="search-query">Поиск: «${app.utils.escapeHTML(app.state.filterState.q)}»<button class="icon-button" data-action="clear-query" aria-label="Очистить поисковый запрос">${app.utils.icon('close')}</button>
			</div>
		`
			: '';
		const chips = [];
		app.state.filterState.brands.forEach(v => chips.push(['brands', v, v]));
		app.state.filterState.seasons.forEach(v => chips.push(['seasons', v, app.data.seasons[v]]));
		['width', 'profile', 'diameter', 'min', 'max', 'carType'].forEach(k => {
			if (app.state.filterState[k]) chips.push([k, app.state.filterState[k], k === 'width'
				? `Ширина: ${app.state.filterState[k]}`
				: k === 'profile'
				? `Профиль: ${app.state.filterState[k]}`
				: k === 'diameter'
				? `R${app.state.filterState[k]}`
				: k === 'min'
				? `От ${app.utils.money(+app.state.filterState[k])}`
				: k === 'max'
				? `До ${app.utils.money(+app.state.filterState[k])}`
				: app.state.filterState[k] === 'suv' ? 'Кроссовер' : 'Легковой']);
		});
		if (app.state.filterState.available) chips.push(['available', 'true', 'В наличии']);
		app.utils.$('#active-filters').innerHTML = chips.map(([key, val, label]) => `
			<button class="filter-chip" data-action="remove-filter" data-key="${key}" data-value="${val}" aria-label="Убрать фильтр ${app.utils.escapeHTML(label)}">${app.utils.escapeHTML(label)}<span>×</span>
			</button>
		`).join('');
	};

	app.catalog.readFilters = function filterFormState() {
		const data = new FormData(app.utils.$('#filters-form'));
		app.state.filterState = {
			...app.state.filterState,
			brands: data.getAll('brands'),
			seasons: data.getAll('seasons'),
			available: data.has('available')
		};
		for (const k of['width', 'profile', 'diameter', 'min', 'max', 'carType']) app.state.filterState[k] = data.get(k)
			|| '';
		app.catalog.renderResults();
	};

	app.catalog.resetFilters = function resetFilters() {
		const sort = app.state.filterState.sort;
		app.state.filterState = { ...app.utils.defaultFilters(), sort };
		app.pages.catalog();
	};

	app.cart.add = function addToCart(id, quantity = 1) {
		const product = app.data.products.find(product => product.id === id);
		if (!product?.available) return;
		const nextQuantity = (app.state.cart[id] || 0) + quantity;
		if (nextQuantity > 99) {
			app.ui.toast('Максимум 99 шин одной модели');
			return;
		}
		app.state.cart[id] = nextQuantity;
		app.storage.save('cart', app.state.cart);
		app.state.orderComplete = false;
		app.ui.updateCounters();
		app.ui.toast(`${product.brand} ${product.model} — добавлено в корзину`);
	};

	app.cart.totals = function cartTotals() {
		return Object.entries(app.state.cart).reduce((totals, [id, quantity]) => {
			const product = app.data.products.find(product => product.id === id);
			totals.count += quantity;
			totals.total += product.price * quantity;
			return totals;
		}, { count: 0, total: 0 });
	};

	app.cart.setQuantity = function applyQuantity(id, value) {
		if (id === 'product') {
			const product = app.data.products.find(product => product.id === location.hash.split('/')[1]);
			if (product) app.utils.$('#set-total').textContent = `${value} шт.: ${app.utils.money(product.price * value)}`;
		} else {
			const focused = document.activeElement;
			const delta = focused?.dataset?.delta;
			app.state.cart[id] = value;
			app.storage.save('cart', app.state.cart);
			app.ui.updateCounters();
			app.pages.cart();
			const selector = delta
				? `[data-action="quantity"][data-id="${id}"][data-delta="${delta}"]`
				: `[data-quantity="${id}"]`;
			app.utils.$(selector)?.focus({ preventScroll: true });
		}
	};

	app.favorites.toggle = function toggleFavorite(id) {
		if (app.state.favorites.has(id)) app.state.favorites.delete(id);
		else app.state.favorites.add(id);
		app.storage.save('favorites', [...app.state.favorites]);
		app.ui.updateCounters();
		if (app.state.currentRoute === 'favorites') app.pages.favorites();
		else app.utils.$$(`[data-action="favorite"][data-id="${id}"]`).forEach(b => {
			b.classList.toggle('selected', app.state.favorites.has(id));
			b.setAttribute('aria-pressed', app.state.favorites.has(id));
			b.setAttribute('aria-label', (app.state.favorites.has(id) ? 'Убрать из избранного: ' : 'В избранное: ') + app.data.products.find(p => p.id === id).model);
		});
		app.ui.toast(app.state.favorites.has(id) ? 'Добавлено в избранное' : 'Удалено из избранного');
	};

	app.router.render = function route() {
		app.ui.closePanel(false);
		const raw = location.hash.slice(1) || 'home';
		if (raw === 'finder' && app.state.currentRoute === 'home') {
			document.getElementById('finder')?.scrollIntoView();
			return;
		}
		const [path, query = ''] = raw.split('?');
		app.state.currentRoute = path.split('/')[0];
		if (app.state.currentRoute === 'finder') app.state.currentRoute = 'home';
		const params = new URLSearchParams(query);
		if (app.state.currentRoute === 'catalog' && query) {
			app.state.filterState = app.utils.defaultFilters();
			if (params.has('season') && app.data.seasons[params.get('season')]) app.state.filterState.seasons = [params.get('season')];
			if (params.has('brand') && app.data.brands.includes(params.get('brand'))) app.state.filterState.brands = [params.get('brand')];
			if (params.has('q')) app.state.filterState.q = params.get('q').slice(0, 200);
			for (const k of['width', 'profile', 'diameter']) if (/^\d{2,3}$/.test(params.get(k) || '')) app.state.filterState[k] = params.get(k);
		}
		const titles = {
			home: 'Шиномонтаж в Москве',
			services: 'Услуги и цены',
			catalog: 'Каталог шин',
			favorites: 'Избранное',
			cart: 'Корзина',
			product: 'Модель шины',
			contacts: 'Контакты',
			about: 'О компании',
			guide: 'Как выбрать шины',
			delivery: 'Доставка и возврат'
		};
		document.title = `${titles[app.state.currentRoute] || 'Шины'} — Шин-Мастер`;
		if (app.state.currentRoute === 'home') app.pages.home();
		else if (app.state.currentRoute === 'services') app.pages.services();
		else if (app.state.currentRoute === 'catalog') app.pages.catalog();
		else if (app.state.currentRoute === 'favorites') app.pages.favorites();
		else if (app.state.currentRoute === 'cart') app.pages.cart();
		else if (app.state.currentRoute === 'product') app.pages.product(path.split('/')[1]);
		else if (app.state.currentRoute === 'contacts') app.pages.contacts();
		else app.pages.info(app.state.currentRoute);
		app.utils.$$('.desktop-nav a').forEach(a => a.classList.toggle('active', a.hash === '#' + app.state.currentRoute));
		window.scrollTo({ top: 0, behavior: 'instant' });
		app.utils.$('#main').focus({ preventScroll: true });
		if (raw === 'finder') document.getElementById('finder')?.scrollIntoView();
	};

	app.bindEvents = function bindEvents() {
		document.addEventListener('click', e => {
			const trigger = e.target.closest('[data-action]');
			if (!trigger) {
				if (e.target.closest('#mobile-menu a')) app.ui.closePanel(false);
				return;
			}
			const { action, id } = trigger.dataset;
			if (action === 'add') app.cart.add(id);
			else if (action === 'favorite') app.favorites.toggle(id);
			else if (action === 'theme') {
				const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
				document.documentElement.dataset.theme = theme;
				app.storage.save('theme', theme);
				app.ui.updateCounters();
			} else if (action === 'home-season') {
				app.state.homeSeason = trigger.dataset.season;
				app.utils.$('#popular-grid').innerHTML = app.pages.popularCards();
				app.utils.$$('.season-tabs .tab').forEach(b => {
					b.classList.toggle('active', b.dataset.season === app.state.homeSeason);
					b.setAttribute('aria-pressed', b.dataset.season === app.state.homeSeason);
				});
			} else if (action === 'brand') {
				location.hash = 'catalog?brand=' + encodeURIComponent(trigger.dataset.brand);
			} else if (action === 'go-finder') {
				e.preventDefault();
				app.utils.$('#finder')?.scrollIntoView({ behavior: 'smooth' });
				app.utils.$('#finder select')?.focus({ preventScroll: true });
			} else if (action === 'search') {
				app.state.focusReturn = trigger;
				app.utils.$('#search-dialog').showModal();
				document.body.classList.add('locked');
			} else if (action === 'close-search') app.utils.$('#search-dialog').close();
			else if (action === 'menu') app.ui.openPanel(app.utils.$('#mobile-menu'), trigger);
			else if (action === 'filters') app.ui.openPanel(app.utils.$('#filters'), trigger);
			else if (action === 'close') app.ui.closePanel();
			else if (action === 'reset') {
				if (app.state.activePanel) app.ui.closePanel(false);
				app.catalog.resetFilters();
			} else if (action === 'clear-query') {
				app.state.filterState.q = '';
				app.catalog.renderResults();
			} else if (action === 'remove-filter') {
				const { key, value } = trigger.dataset;
				if (Array.isArray(app.state.filterState[key])) app.state.filterState[key] = app.state.filterState[key].filter(v => v !== value);
				else app.state.filterState[key] = key === 'available' ? false : '';
				app.pages.catalog();
			} else if (action === 'add-product') {
				app.cart.add(id, Math.max(1, Math.min(99, Number(app.utils.$('[data-quantity="product"]').value) || 1)));
			} else if (action === 'quantity') {
				const input = app.utils.$(`[data-quantity="${id}"]`);
				const next = Math.max(1, Math.min(99, (Number(input.value) || 1) + Number(trigger.dataset.delta)));
				input.value = next;
				app.cart.setQuantity(id, next);
			} else if (action === 'remove-cart') {
				delete app.state.cart[id];
				app.storage.save('cart', app.state.cart);
				app.ui.updateCounters();
				app.pages.cart();
				app.ui.toast('Товар удалён из корзины');
			} else if (action === 'back-cart') {
				app.state.orderComplete = false;
				app.pages.cart();
			} else if (action === 'checkout') {
				if (!app.cart.totals().count) return;
				app.state.orderComplete = true;
				app.pages.cart();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		});

		document.addEventListener('change', e => {
			if (e.target.closest('#filters-form')) app.catalog.readFilters();
			else if (e.target.id === 'sort') {
				app.state.filterState.sort = e.target.value;
				app.catalog.renderResults();
			} else if (e.target.matches('[data-quantity]')) {
				const value = Math.max(1, Math.min(99, Math.floor(Number(e.target.value) || 1)));
				e.target.value = value;
				app.cart.setQuantity(e.target.dataset.quantity, value);
			}
		});

		document.addEventListener('input', e => {
			if (e.target.matches('#filters-form input[type="number"]')) app.catalog.readFilters();
		});

		document.addEventListener('submit', e => {
			if (e.target.id === 'finder-form') {
				e.preventDefault();
				const d = new FormData(e.target);
				const params = new URLSearchParams();
				for (const [k, v] of d) if (v) params.set(k, v);
				app.state.filterState = app.utils.defaultFilters();
				const hash = 'catalog' + (params.size ? '?' + params : '');
				if (location.hash === '#' + hash) app.router.render();
				else location.hash = hash;
			} else if (e.target.id === 'search-form') {
				e.preventDefault();
				const q = app.utils.$('#site-search').value.trim().slice(0, 200);
				app.utils.$('#search-dialog').close();
				app.state.filterState = app.utils.defaultFilters();
				const hash = 'catalog' + (q ? '?q=' + encodeURIComponent(q) : '');
				if (location.hash === '#' + hash) app.router.render();
				else location.hash = hash;
			}
		});

		app.utils.$('#search-dialog').addEventListener('close', () => {
			document.body.classList.remove('locked');
			if (app.state.focusReturn?.isConnected) app.state.focusReturn.focus();
			app.state.focusReturn = null;
		});

		app.utils.$('#search-dialog').addEventListener('click', e => {
			if (e.target === e.currentTarget) {
				const r = e.currentTarget.getBoundingClientRect();
				if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close();
			}
		});

		app.utils.$('#overlay').addEventListener('click', () => app.ui.closePanel());

		document.addEventListener('keydown', e => {
			if (!app.state.activePanel) return;
			if (e.key === 'Escape') {
				e.preventDefault();
				app.ui.closePanel();
			}
			if (e.key === 'Tab') {
				const focusable = app.utils.$$('a[href],button:not(:disabled),input,select', app.state.activePanel).filter(el => el.getClientRects().length);
				const first = focusable[0],
				last = focusable.at(-1);
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		});

		window.addEventListener('resize', () => {
			if (app.state.activePanel && window.innerWidth >= 768) app.ui.closePanel();
		});

		window.addEventListener('hashchange', app.router.render);

		document.addEventListener('error', event => {
			const image = event.target;
			if (!image?.dataset?.productImage || image.dataset.fallbackStep) return;
			image.dataset.fallbackStep = '1';
			image.alt = 'Изображение временно недоступно. Общая иллюстрация шины.';
			image.src = app.data.tireVisuals.summer;
			const note = image.closest('.product-photo')?.querySelector('.image-note');
			if (note) note.textContent = image.alt;
		}, true);
	};

	app.bindEvents();
	app.ui.syncFooterContacts();
	app.ui.updateCounters();
	app.router.render();
})(window.ShinMaster);
