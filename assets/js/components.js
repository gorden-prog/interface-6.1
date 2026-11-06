(function (app) {
	'use strict';

	app.components.breadcrumb = function breadcrumb(label) {
		return `
			<div class="breadcrumb">
				<a href="#home">Главная</a>
				<span>/</span>
				<span>${app.utils.escapeHTML(label)}</span>
			</div>
		`;
	};

	app.components.pageHead = function pageHead(title, subtitle = '') {
		return `
			<div class="container page-head">${app.components.breadcrumb(title)}<h1>${title}</h1>${subtitle
			? `
				<p>${subtitle}</p>
			`
			: ''}</div>
		`;
	};

	app.components.checkGroup = function checkGroup(name, values, selected) {
		return values.map(([value, label]) => `
			<label class="check-label">
				<input type="checkbox" name="${name}" value="${value}" ${selected.includes(value) ? 'checked' : ''}>
				<span>${label}</span>
			</label>
		`).join('');
	};

	app.components.emptyState = function empty(title, desc, button, action, href = '') {
		return `
			<div class="empty-state">${app.utils.icon('search')}<h2>${title}</h2>
				<p>${desc}</p>${href
			? `
				<a class="button primary" href="${href}">${button} ${app.utils.icon('arrow')}</a>
			`
			: `
				<button class="button primary" data-action="${action}">${button}</button>
			`}</div>
		`;
	};

	app.components.quantityControl = function quantityControl(id, q) {
		return `
			<div class="quantity">
				<button type="button" data-action="quantity" data-id="${id}" data-delta="-1" aria-label="Уменьшить количество">−</button>
				<input type="number" min="1" max="99" value="${q}" inputmode="numeric" data-quantity="${id}" aria-label="Количество шин">
				<button type="button" data-action="quantity" data-id="${id}" data-delta="1" aria-label="Увеличить количество">+</button>
			</div>
		`;
	};

	app.components.productCard = function card(product) {
		const isFavorite = app.state.favorites.has(product.id);
		const favoriteClass = isFavorite ? 'selected' : '';
		const favoriteLabel = isFavorite ? 'Убрать из избранного' : 'В избранное';
		const availabilityClass = product.available ? '' : 'unavailable';
		const availabilityLabel = product.available ? 'В наличии' : 'Нет в наличии';
		const buttonLabel = product.available ? 'В корзину' : 'Нет в наличии';
		const oldPrice = product.oldPrice ? `<del>${app.utils.money(product.oldPrice)}</del>` : '';
		let badge = '';

		if (product.oldPrice) {
			const discount = Math.round((1 - product.price / product.oldPrice) * 100);
			badge = `<span class="badge sale">−${discount}%</span>`;
		} else if (product.popular) {
			badge = '<span class="badge">ВЫБОР ПОКУПАТЕЛЕЙ</span>';
		}

		return `
			<article class="card">
				<a class="card-visual" href="#product/${product.id}" tabindex="-1" aria-hidden="true">
					<img
						src="${app.utils.escapeHTML(product.image)}"
						data-product-image="${product.id}"
						alt=""
						loading="lazy"
						width="400"
						height="400"
					>
					${badge}
				</a>
				<button
					class="icon-button favorite-button ${favoriteClass}"
					data-action="favorite"
					data-id="${product.id}"
					aria-pressed="${isFavorite}"
					aria-label="${favoriteLabel}: ${app.utils.escapeHTML(product.model)}"
				>
					${app.utils.icon('heart')}
				</button>
				<div class="card-content">
					<div class="card-season">${app.utils.icon(product.season)}${app.data.seasons[product.season]}</div>
					<div class="card-brand">${product.brand}</div>
					<h3><a href="#product/${product.id}">${app.utils.escapeHTML(product.model)}</a></h3>
					<p class="card-size">${app.utils.size(product)} <span>· ${product.loadIndex}${product.speedIndex}</span></p>
					<span class="availability ${availabilityClass}">${availabilityLabel}</span>
					<div class="card-price">
						<strong>${app.utils.money(product.price)}</strong>
						${oldPrice}
					</div>
					<span class="per-unit">за одну шину</span>
					<button
						class="button secondary card-add"
						data-action="add"
						data-id="${product.id}"
						${product.available ? '' : 'disabled'}
					>
						${buttonLabel}
						${app.utils.icon('bag')}
					</button>
				</div>
			</article>
		`;
	};

	app.components.servicePreview = function servicesPreview() {
		const services = [
			{ number: '01', title: 'Сезонная замена шин', unit: '4 шины', price: 2000 },
			{ number: '02', title: 'Компьютерная балансировка', unit: '1 колесо', price: 200 },
			{ number: '03', title: 'Выездной шиномонтаж', unit: '1 услуга', price: 1500 }
		];

		const cards = services.map(service => `
			<a href="#services" class="service-preview-card">
				<span class="service-number">${service.number}</span>
				<h3>${service.title}</h3>
				<div class="service-preview-bottom">
					<p>${service.unit}</p>
					<strong>${app.utils.money(service.price)}</strong>
					${app.utils.icon('arrow')}
				</div>
			</a>
		`).join('');

		return `
			<section class="container section service-preview">
				<div class="section-header">
					<div>
						<div class="eyebrow">ШИНОМОНТАЖ В МОСКВЕ</div>
						<h2>Всё для ваших колёс</h2>
						<p>В наших точках и с выездом к автомобилю.</p>
					</div>
					<a class="text-link" href="#services">Все услуги и цены ${app.utils.icon('arrow')}</a>
				</div>
				<div class="service-preview-grid">${cards}</div>
			</section>
		`;
	};
})(window.ShinMaster);
