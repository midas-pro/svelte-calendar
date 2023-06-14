import {writable} from 'svelte/store';
import {intl} from '@event-calendar/core';
import {days} from './stores.js';
import View from './View.svelte';

export default {
	createOptions(options) {
		options.dayMaxEvents = false;
		options.dayPopoverFormat = {month: 'long', day: 'numeric', year: 'numeric'};
		options.moreLinkContent = undefined;
		// Common options
		options.buttonText.dayGridMonth = 'month';
		options.theme.uniform = 'ec-uniform';
		options.theme.dayFoot = 'ec-day-foot';
		options.theme.month = 'ec-month';
		options.theme.popup = 'ec-popup';
		options.view = 'dayGridMonth';
		options.views.dayGridMonth = {
			component: View,
			dayHeaderFormat: {weekday: 'short'},
			displayEventEnd: false,
			duration: {months: 1},
			titleFormat: {year: 'numeric', month: 'long'}
		};
	},

	createStores(state) {
		state._days = days(state);
		state._intlDayPopover = intl(state.locale, state.dayPopoverFormat);
		state._hiddenEvents = writable({});
		state._popupDate = writable(null);
		state._popupChunks = writable([]);
	}
}
