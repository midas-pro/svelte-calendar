import {btnTextDay, btnTextWeek, themeView} from '@event-calendar/core';
import {slotTimeLimits, times} from './stores.js';
import View from './View.svelte';

export {default as Section} from './Section.svelte';
export {default as Body} from './Body.svelte';
export {default as Day} from './Day.svelte';
export {default as Week} from './all-day/Week.svelte';

export default {
	createOptions(options) {
		// Common options
		options.buttonText.timeGridDay = 'day';
		options.buttonText.timeGridWeek = 'week';
		options.view = 'timeGridWeek';
		options.views.timeGridDay = {
			buttonText: btnTextDay,
			component: View,
			dayHeaderFormat: {weekday: 'long'},
			duration: {days: 1},
			theme: themeView('ec-time-grid ec-day-view'),
			titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
		};
		options.views.timeGridWeek = {
			buttonText: btnTextWeek,
			component: View,
			duration: {weeks: 1},
			theme: themeView('ec-time-grid ec-week-view')
		};
	},

	createStores(state) {
		state._slotTimeLimits = slotTimeLimits(state);  // flexible limits
		state._times = times(state);
	}
}
