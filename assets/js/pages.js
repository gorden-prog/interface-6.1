(function (app) {
	'use strict';

	app.pages.home = function renderHome() {
		const seasonOptions = Object.entries(app.data.seasons).map(([k, v]) => `
				<option value="${k}">${v}</option>
			`).join('');

		const brandButtons = app.data.brands.map(b => `
				<button class="brand-word" data-action="brand" data-brand="${b}" aria-label="Шины ${b}">${b === 'Michelin'
			? 'MICHELIN'
			: b === 'Pirelli'
			? 'PIRELLI'
			: b === 'Bridgestone'
			? 'BRIDGESTONE'
			: b === 'Yokohama'
			? 'YOKOHAMA'
			: b === 'Hankook' ? 'Hankook' : b === 'Cordiant' ? 'cordiant' : b}</button>
			`).join('');

		const seasonTabs = [
			['', 'Все шины'],
			['summer', 'Летние'],
			['winter', 'Зимние']
		].map(([k, v]) => `
				<button class="tab ${app.state.homeSeason === k ? 'active' : ''}" data-action="home-season" data-season="${k}" aria-pressed="${app.state.homeSeason === k}">${v}</button>
			`).join('');

		const seasonTiles = [
			['summer', 'Летние шины', 'Точность управления. Сухой и мокрый асфальт.'],
			['winter', 'Зимние шины', 'Уверенность в холодное время года.'],
			['all', 'Всесезонные шины', 'Универсальный выбор для мягкого климата.']
		].map(([key, title, desc]) => `
				<a href="#catalog?season=${key}" class="season-tile">${app.utils.icon(key)}<h3>${title}</h3>
					<p>${desc}</p>
					<span class="tile-arrow" aria-hidden="true">${app.utils.icon('arrow')}</span>
				</a>
			`).join('');

		const benefitCards = [
			['shield', 'Проверенные бренды', 'Восемь производителей с мировым именем.'],
			['filter', 'Точный подбор', 'Размер, сезон и параметры вашего автомобиля.'],
			['box', 'От одной шины', 'Выбирайте нужное количество или комплект.'],
			['truck', 'Две точки в Москве', 'Выберите удобный адрес нашего магазина.']
		].map(([i, t, d]) => `
				<article class="benefit">${app.utils.icon(i)}<h3>${t}</h3>
					<p>${d}</p>
				</article>
			`).join('');

		app.utils.$('#main').innerHTML = `
			<section class="hero" aria-label="Шиномонтаж в Москве">
				<div class="container hero-inner">
					<img class="hero-image" src="assets/images/hero-tires.png" alt="Две автомобильные шины в выразительном студийном освещении" fetchpriority="high" width="1536" height="1024">
					<div class="hero-copy">
						<div class="eyebrow">СЦЕПЛЕНИЕ С ДОРОГОЙ. УВЕРЕННОСТЬ В СЕБЕ.</div>
						<h1>ШИНОМОНТАЖ<br>В МОСКВЕ<span style="color:var(--accent)">.</span>
						</h1>
						<p>Сезонная замена шин, балансировка и ремонт колёс. Две точки в Москве и выездной шиномонтаж.</p>
						<div class="hero-actions">
							<a class="button primary" href="#services">Услуги и цены ${app.utils.icon('arrow')}</a>
							<a class="button secondary" href="#finder" data-action="go-finder">Подобрать шины</a>
						</div>
					</div>
					<div class="hero-index">01 <span></span> СОЗДАНЫ ДЛЯ ВАШЕГО ПУТИ</div>
					<div class="hero-meta">
						<span>8 ВЕДУЩИХ БРЕНДОВ</span>
						<span>ЛЮБОЙ СЕЗОН. ВАША ДОРОГА.</span>
					</div>
				</div>
			</section>
			<section class="container finder-section" id="finder" aria-labelledby="finder-title">
				<div class="finder">
					<div class="finder-top">
						<h2 id="finder-title">Ваш идеальный комплект</h2>
						<p>Начните с размера. Остальное — дело выбора.</p>
					</div>
					<form class="finder-form" id="finder-form">
						<label class="field">Ширина, мм<select name="width" aria-label="Ширина шины">${app.utils.options(app.utils.widths)}</select>
						</label>
						<label class="field">Профиль, %<select name="profile" aria-label="Профиль шины">${app.utils.options(app.utils.profiles)}</select>
						</label>
						<label class="field">Диаметр<select name="diameter" aria-label="Диаметр шины">${app.utils.options(app.utils.diameters, '', 'R')}</select>
						</label>
						<label class="field">Сезон<select name="season">
								<option value="">Любой сезон</option>${seasonOptions}</select>
						</label>
						<button class="button primary" type="submit">Найти шины ${app.utils.icon('arrow')}</button>
					</form>
				</div>
			</section>
			<section class="container brands" aria-label="Популярные бренды">${brandButtons}</section>
			${app.components.servicePreview()}
			<section class="container section">
				<div class="section-header">
					<div>
						<div class="eyebrow">ПРОВЕРЕНЫ ДОРОГОЙ</div>
						<h2>Выбор наших покупателей</h2>
						<p>Модели, с которых стоит начать знакомство.</p>
					</div>
					<div class="season-tabs" role="group" aria-label="Сезон популярных шин">${seasonTabs}</div>
				</div>
				<div class="product-grid home-grid" id="popular-grid">${app.pages.popularCards()}</div>
				<div class="home-catalog-link">
					<a href="#catalog" class="text-link">Перейти в каталог ${app.utils.icon('arrow')}</a>
				</div>
			</section>
			<section class="container section season-section">
				<div class="section-header">
					<div>
						<div class="eyebrow">В РИТМЕ ПРИРОДЫ</div>
						<h2>Для каждого сезона</h2>
					</div>
				</div>
				<div class="season-grid">${seasonTiles}</div>
			</section>
			<section class="container benefits" aria-label="Преимущества магазина">${benefitCards}</section>
			<section class="container guide-banner">
				<div>
					<div class="eyebrow">ПОЛЕЗНО ЗНАТЬ</div>
					<h2>Хорошая дорога начинается<br>с правильного выбора.</h2>
				</div>
				<div>
					<div class="guide-number">225 / 45 R17 <span>Три параметра,<br>которые имеют значение</span>
					</div>
					<p>Как прочитать маркировку, выбрать сезонность и найти свой размер? Собрали самое важное в одном коротком руководстве.</p>
					<a href="#guide" class="text-link">Как выбрать шины ${app.utils.icon('arrow')}</a>
				</div>
			</section>
		`;
	};

	app.pages.popularCards = function popularCards() {
		let list = app.data.products.filter(p => p.popular && (!app.state.homeSeason || p.season === app.state.homeSeason));
		if (list.length < 4) list = [...list, ...app.data.products.filter(p => !list.includes(p) && (!app.state.homeSeason
			|| p.season === app.state.homeSeason))];
		return list.slice(0, 4).map(app.components.productCard).join('');
	};

	app.pages.catalog = function renderCatalog() {
		app.utils.$('#main').innerHTML = app.components.pageHead('Каталог шин', 'Ваш автомобиль. Ваш маршрут. Ваш идеальный комплект.') + `
			<div class="container catalog-layout">
				<aside class="filters" id="filters" aria-label="Фильтры каталога">
					<div class="panel-heading">
						<strong>ПОДОБРАТЬ ШИНЫ</strong>
						<button class="icon-button filter-close" data-action="close" aria-label="Закрыть фильтры">${app.utils.icon('close')}</button>
					</div>
					<form id="filters-form">
						<div class="filter-group">
							<h3>Производитель</h3>
							<div class="filter-options">${app.components.checkGroup('brands', app.data.brands.map(v => [v, v]), app.state.filterState.brands)}</div>
						</div>
						<div class="filter-group">
							<h3>Размер шины</h3>
							<label class="field">Ширина, мм<select name="width">${app.utils.options(app.utils.widths, app.state.filterState.width)}</select>
							</label>
							<div class="filter-row" style="margin-top:12px">
								<label class="field">Профиль, %<select name="profile">${app.utils.options(app.utils.profiles, app.state.filterState.profile)}</select>
								</label>
								<label class="field">Диаметр<select name="diameter">${app.utils.options(app.utils.diameters, app.state.filterState.diameter, 'R')}</select>
								</label>
							</div>
						</div>
						<div class="filter-group">
							<h3>Сезонность</h3>
							<div class="filter-options">${app.components.checkGroup('seasons', Object.entries(app.data.seasons), app.state.filterState.seasons)}</div>
						</div>
						<div class="filter-group">
							<h3>Цена за шину, ₽</h3>
							<div class="filter-row">
								<label class="field">От<input type="number" name="min" min="0" max="1000000" placeholder="3 990" value="${app.state.filterState.min}">
								</label>
								<label class="field">До<input type="number" name="max" min="0" max="1000000" placeholder="22 490" value="${app.state.filterState.max}">
								</label>
							</div>
						</div>
						<div class="filter-group">
							<h3>Тип автомобиля</h3>
							<label class="field">
								<span class="sr-label">Автомобиль</span>
								<select name="carType">
									<option value="">Все автомобили</option>
									<option value="car"${app.state.filterState.carType === 'car' ? 'selected' : ''}>Легковой</option>
									<option value="suv"${app.state.filterState.carType === 'suv' ? 'selected' : ''}>Кроссовер</option>
								</select>
							</label>
						</div>
						<div class="filter-group">
							<label class="check-label">
								<input type="checkbox" name="available"${app.state.filterState.available ? 'checked' : ''}>
								<span>Только в наличии</span>
							</label>
						</div>
						<button type="button" class="button secondary filter-reset" data-action="reset">Сбросить фильтры</button>
						<button type="button" class="button primary filter-apply" data-action="close">Показать шины ${app.utils.icon('arrow')}</button>
					</form>
				</aside>
				<section aria-label="Товары">
					<div class="catalog-toolbar">
						<button class="button secondary filter-mobile-button" data-action="filters">${app.utils.icon('filter')}Фильтры</button>
						<span class="result-count" id="result-count"></span>
						<label>Сортировка: <select id="sort" aria-label="Сортировка шин">
								<option value="popular">По популярности</option>
								<option value="price-asc">Сначала дешёвые</option>
								<option value="price-desc">Сначала дорогие</option>
								<option value="name">По названию</option>
							</select>
						</label>
					</div>
					<div id="query-label"></div>
					<div class="active-filters" id="active-filters"></div>
					<div class="product-grid catalog-grid" id="catalog-grid"></div>
				</section>
			</div>
		`;
		app.utils.$('#sort').value = app.state.filterState.sort;
		app.catalog.renderResults();
	};

	app.pages.product = function renderProduct(id) {
		const product = app.data.products.find(product => product.id === id);
		if (!product) {
			app.utils.$('#main').innerHTML = app.components.pageHead('Модель не найдена') + `
				<div class="container section">${app.components.emptyState('Этой модели нет в каталоге',
				'Выберите другую шину из доступных моделей.', 'В каталог', '', '#catalog')}</div>
			`;
			return;
		}
		const specs = [
			['Бренд', product.brand],
			['Модель', product.model],
			['Ширина профиля', product.width + ' мм'],
			['Высота профиля', product.profile + ' %'],
			['Посадочный диаметр', 'R' + product.diameter],
			['Сезонность', app.data.seasons[product.season]],
			['Индекс нагрузки', product.loadIndex],
			['Индекс скорости', product.speedIndex],
			['Тип автомобиля', product.carType === 'suv' ? 'Кроссовер' : 'Легковой']
		];
		const specRows = specs.map(([k, v]) => `
				<tr>
					<td>${k}</td>
					<td>${v}</td>
				</tr>
			`).join('');

		const relatedCards = app.data.products.filter(candidate => candidate.season === product.season && candidate.id !== product.id).slice(0,
			4).map(app.components.productCard).join('');

		app.utils.$('#main').innerHTML = `
			<div class="container page-head">
				<div class="breadcrumb">
					<a href="#home">Главная</a>
					<span>/</span>
					<a href="#catalog">Каталог</a>
					<span>/</span>
					<span>${product.brand} ${app.utils.escapeHTML(product.model)}</span>
				</div>
			</div>
			<section class="container product-main">
				<div class="product-photo">
					<img src="${app.utils.escapeHTML(product.image)}" data-product-image="${product.id}" width="600" height="600" alt="${app.data.seasons[product.season]}шины — иллюстрация">
					<span class="image-note">Иллюстрация типа шины. Внешний вид конкретной модели может отличаться.</span>
					<button class="icon-button favorite-button ${app.state.favorites.has(product.id) ? 'selected' : ''}" data-action="favorite" data-id="${product.id}" aria-pressed="${app.state.favorites.has(product.id)}" aria-label="${app.state.favorites.has(product.id) ? 'Убрать из избранного' : 'В избранное'}: ${app.utils.escapeHTML(product.model)}">${app.utils.icon('heart')}</button>
				</div>
				<div class="product-info">
					<div class="eyebrow">${product.brand.toUpperCase()}</div>
					<h1>${app.utils.escapeHTML(product.model)}</h1>
					<p class="product-size">${app.utils.size(product)} ${product.loadIndex}${product.speedIndex}</p>
					<div class="card-season" style="margin-top:16px">${app.utils.icon(product.season)}${app.data.seasons[product.season]} шины · ${product.carType === 'suv' ? 'для кроссоверов' : 'для легковых автомобилей'}</div>
					<p class="product-description">${product.description}</p>
					<span class="availability ${product.available ? '' : 'unavailable'}">${product.available ? 'В наличии' : 'Нет в наличии'}</span>
					<div class="product-price">
						<strong>${app.utils.money(product.price)}</strong>${product.oldPrice
			? `
				<del>${app.utils.money(product.oldPrice)}</del>
			`
			: ''}<p class="per-unit">Цена за одну шину</p>
					</div>
					<div class="product-buy">${app.components.quantityControl('product', 4)}<button class="button primary" data-action="add-product" data-id="${product.id}" ${product.available ? '' : 'disabled'}>${product.available ? 'Добавить в корзину' : 'Нет в наличии'} ${app.utils.icon('bag')}</button>
					</div>
					<p class="product-note" id="set-total">Комплект из 4 шин:${app.utils.money(product.price * 4)}</p>
				</div>
			</section>
			<section class="container product-details">
				<div>
					<h2>Характеристики</h2>
					<table class="spec-table">
						<caption class="sr-only">Характеристики${product.brand} ${app.utils.escapeHTML(product.model)}</caption>
						<tbody>${specRows}</tbody>
					</table>
				</div>
				<aside class="info-block">
					<h2>Проверьте совместимость</h2>
					<p>Перед покупкой сверьте размер и индексы с рекомендациями производителя автомобиля. Уточните характеристики, стоимость и наличие выбранной модели по телефону.</p>
					<a href="#guide" class="text-link">Разобраться в маркировке ${app.utils.icon('arrow')}</a>
				</aside>
			</section>
			<section class="container section related-section">
				<div class="section-header">
					<h2>В том же сезоне</h2>
					<a class="text-link" href="#catalog?season=${product.season}">Все модели ${app.utils.icon('arrow')}</a>
				</div>
				<div class="product-grid home-grid">${relatedCards}</div>
			</section>
		`;
	};

	app.pages.cart = function renderCart() {
		const { count, total } = app.cart.totals();
		app.utils.$('#main').innerHTML = app.components.pageHead('Ваша корзина', count
			? `${count} шт. · Всё готово для следующего маршрута.`
			: 'Ваш следующий маршрут начинается здесь.') + `
			<section class="container cart-page">${app.state.orderComplete
			? `
				<div class="order-success">${app.utils.icon('check')}<h2>Подтвердите заказ по телефону</h2>
					<p>Свяжитесь с нами, чтобы уточнить наличие и согласовать покупку. Выбранные шины сохранены в корзине.</p>
					<div class="order-items">${Object.entries(app.state.cart).map(([id, quantity]) => {
			const product = app.data.products.find(product => product.id === id);
			return `
						<p>${app.utils.escapeHTML(product.brand)} ${app.utils.escapeHTML(product.model)} · ${app.utils.size(product)} · ${quantity}шт.</p>
					`;
		}).join('')}</div>
					<p>
						<strong>${count} шт. · ${app.utils.money(total)}</strong>
					</p>
					<a class="button primary" href="${app.data.contacts.tel}">${app.utils.icon('bag')} ${app.data.contacts.phone}</a>
					<button class="button secondary" data-action="back-cart">Вернуться в корзину</button>
				</div>
			`
			: count
			? `
				<div class="cart-layout">
					<div>${Object.entries(app.state.cart).map(([id, quantity]) => {
			const product = app.data.products.find(product => product.id === id);
			return `
						<article class="cart-row">
							<a href="#product/${id}" tabindex="-1" aria-hidden="true">
								<img src="${app.utils.escapeHTML(product.image)}" data-product-image="${product.id}" alt="" width="100" height="120">
							</a>
							<div>
								<div class="card-brand">${product.brand}</div>
								<h3>
									<a href="#product/${id}">${app.utils.escapeHTML(product.model)}</a>
								</h3>
								<p>${app.utils.size(product)} · ${app.data.seasons[product.season]}</p>${app.components.quantityControl(id, quantity)}</div>
							<div class="cart-row-price">
								<strong>${app.utils.money(product.price * quantity)}</strong>
								<span>${app.utils.money(product.price)}/ шт.</span>
								<button class="icon-button" data-action="remove-cart" data-id="${id}" aria-label="Удалить ${app.utils.escapeHTML(product.model)} из корзины">${app.utils.icon('trash')}</button>
							</div>
						</article>
					`;
		}).join('')}</div>
					<aside class="cart-summary">
						<h2>Ваш заказ</h2>
						<div class="summary-line">
							<span>Шины</span>
							<span>${count}шт.</span>
						</div>
						<div class="summary-line">
							<span>Стоимость товаров</span>
							<span>${app.utils.money(total)}</span>
						</div>
						<div class="summary-line summary-total">
							<span>Итого</span>
							<strong>${app.utils.money(total)}</strong>
						</div>
						<button class="button primary" data-action="checkout">Согласовать заказ ${app.utils.icon('arrow')}</button>
						<p>Покупка подтверждается по телефону. Итог включает стоимость шин; цену и наличие уточнит сотрудник.</p>
						<a class="text-link" href="#catalog" style="margin-top:20px">Продолжить покупки</a>
					</aside>
				</div>
			`
			: app.components.emptyState('Пока здесь пусто', 'Найдите шины для своего автомобиля — и они появятся здесь.', 'Выбрать шины',
			'', '#catalog')}</section>
		`;
	};

	app.pages.favorites = function renderFavorites() {
		app.utils.$('#main').innerHTML = app.components.pageHead('Избранное', 'Сохраните модели, к которым хочется вернуться.') + `
			<section class="container favorites-page">
				<div class="product-grid home-grid">${app.state.favorites.size
			? app.data.products.filter(p => app.state.favorites.has(p.id)).map(app.components.productCard).join('')
			: app.components.emptyState('Ваш выбор ещё впереди', 'Добавляйте понравившиеся шины с помощью значка сердца.', 'Перейти в каталог',
			'', '#catalog')}</div>
			</section>
		`;
	};

	app.pages.services = function renderServices() {
		const serviceGroups = app.data.serviceGroups.map((g, i) => `
				<details class="service-group" open>
					<summary>
						<span class="service-number">0${i + 1}</span>
						<h2>${g.title}</h2>${app.utils.icon('arrow')}</summary>
					<dl class="service-price-list">${g.items.map(([name, unit, price]) => `
					<div class="service-price-row">
						<dt>${app.utils.escapeHTML(name)}${unit
			? `
						<span>${app.utils.escapeHTML(unit)}</span>
					`
			: ''}</dt>
						<dd>${app.utils.money(price)}</dd>
					</div>
				`).join('')}</dl>
				</details>
			`).join('');

		app.utils.$('#main').innerHTML = app.components.pageHead('Шиномонтаж и услуги', 'Сезонная смена шин, ремонт колёс и помощь на дороге.') + `
			<section class="container services-intro">
				<p>Выберите нужную услугу в прайсе. Чтобы согласовать работы, стоимость и удобную точку, свяжитесь с нами по телефону.</p>
				<a class="button primary" href="${app.data.contacts.tel}">${app.data.contacts.phone} ${app.utils.icon('arrow')}</a>
			</section>
			<section class="container services-page" aria-label="Прайс на услуги">
				<div class="services-grid">${serviceGroups}</div>
				<aside class="service-contact">
					<div>
						<div class="eyebrow">ВЫБЕРИТЕ УДОБНЫЙ АДРЕС</div>
						<h2>Две точки в Москве.<br>Один Шин-Мастер.</h2>
						<p>Наличие услуги в конкретной точке и условия выезда уточняйте по телефону.</p>
					</div>
					<div class="service-contact-actions">
						<a class="button primary" href="${app.data.contacts.tel}">${app.data.contacts.phone}</a>
						<a class="button secondary" href="#contacts">Адреса и маршруты ${app.utils.icon('arrow')}</a>
					</div>
				</aside>
			</section>
		`;
	};

	app.pages.contacts = function renderContacts() {
		const contacts = app.data.contacts;
		app.utils.$('#main').innerHTML = app.components.pageHead('Будем на связи', 'Шин-Мастер · шиномонтаж в Москве') + `
			<section class="container contact-intro">
				<p>Обратитесь к нам по телефону или электронной почте. Выберите удобную точку шиномонтажа и постройте маршрут в Яндекс Картах.</p>
				<div class="contact-links">
					<a class="contact-phone" href="${contacts.tel}">${contacts.phone}</a>
					<a class="contact-email" href="mailto:${contacts.email}">${contacts.email}</a>
				</div>
			</section>
			<section class="container locations" aria-label="Точки шиномонтажа">${contacts.locations.map((location, index) => `
				<article class="location-card">
					<span class="location-number">ШИНОМОНТАЖ / 0${index + 1}</span>
					<h2>
						<address>
							<span style="font-size:13px;color:var(--muted)">г. Москва</span>
							<br>${location.title}</address>
					</h2>
					<a class="button secondary" href="${app.utils.mapLink(location.address)}" target="_blank" rel="noopener noreferrer" aria-label="Построить маршрут: ${location.address}">Построить маршрут <span>↗</span>
					</a>
				</article>
			`).join('')}</section>
		`;
	};

	app.pages.info = function renderInfo(route) {
		const pages = {
			about: ['Шин-Мастер в Москве', `
			<p>«Шин-Мастер» — шины и шиномонтаж в Москве. На сайте вы можете подобрать шины для легкового автомобиля или кроссовера, сравнить модели и собрать комплект.</p>
			<h2>Выбор, в котором легко разобраться</h2>
			<p>В каталоге представлены модели восьми брендов: Michelin, Pirelli, Continental, Bridgestone, Hankook, Nokian Tyres, Yokohama и Cordiant. Фильтруйте по сезону, размеру и цене, сохраняйте понравившиеся модели и собирайте свой комплект.</p>
			<h2>Две точки в Москве</h2>
			<p>Выберите удобный адрес в разделе «Контакты» и постройте маршрут. По вопросам наличия шин и покупки обращайтесь по телефону или электронной почте.</p>
			<a class="button primary" href="#catalog">Открыть каталог ${app.utils.icon('arrow')}</a>
		`],
			guide: ['Как выбрать свои шины', `
			<p>Отправная точка — руководство по эксплуатации автомобиля, табличка в дверном проёме или на лючке топливного бака. Используйте рекомендованные производителем размеры и индексы.</p>
			<h2>Разбираем 225 / 45 R17</h2>
			<ul>
				<li>
					<strong>225</strong> — ширина профиля в миллиметрах.</li>
				<li>
					<strong>45</strong> — высота профиля в процентах от ширины.</li>
				<li>
					<strong>R</strong> — радиальная конструкция. <strong>17</strong> — посадочный диаметр в дюймах.</li>
			</ul>
			<h2>Индексы нагрузки и скорости</h2>
			<p>Цифры и буква после размера обозначают допустимую нагрузку и категорию скорости. Подбирайте их по документации автомобиля, а официальные значения уточняйте у производителя шины.</p>
			<h2>Сезон имеет значение</h2>
			<p>Летние, зимние и всесезонные модели рассчитаны на разные условия эксплуатации. Учитывайте местный климат, маршрут и рекомендации производителя. Всесезонные шины требуют особенно внимательной оценки пригодности для вашего климата.</p>
			<h2>Перед оформлением</h2>
			<p>Проверьте совместимость, количество и состояние шин на автомобиле. Для окончательного выбора сверьтесь с официальной спецификацией производителя шины.</p>
			<a class="button primary" href="#catalog">Подобрать шины ${app.utils.icon('arrow')}</a>
		`],
			delivery: ['Доставка и возврат', `
			<p>Соберите нужные шины в корзине и свяжитесь с нами для подтверждения покупки.</p>
			<h2>Получение заказа</h2>
			<p>Уточните у сотрудника наличие выбранных моделей, удобную точку получения и доступные варианты доставки до подтверждения покупки.</p>
			<h2>Возврат и обмен</h2>
			<p>По вопросам возврата или обмена приобретённых шин обратитесь к нам по телефону или электронной почте. Сотрудник уточнит обстоятельства покупки и порядок обращения.</p>
			<a class="button secondary" href="#contacts">Контакты магазина ${app.utils.icon('arrow')}</a>
		`]
		};
		const [title, content] = pages[route] || pages.about;
		app.utils.$('#main').innerHTML = app.components.pageHead(title) + `
			<section class="container">
				<article class="prose">${content}</article>
			</section>
		`;
	};
})(window.ShinMaster);
