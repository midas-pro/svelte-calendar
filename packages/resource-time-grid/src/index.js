import View from './View.svelte';

export default {
	createOptions(options) {
		options.resources = [];
		options.hideResourcesWithNoEvents = false;
		// Common options
		options.buttonText.resourceTimeGridDay = 'day';
		options.buttonText.resourceTimeGridWeek = 'week';
		options.theme.resource = 'ec-resource';
		options.theme.resourceTitle = 'ec-resource-title';
		options.view = 'resourceTimeGridWeek';
		options.views.resourceTimeGridDay = {
			component: View,
			duration: {days: 1}
		};
		options.views.resourceTimeGridWeek = {
			component: View,
			duration: {weeks: 1}
		};
	},
	createMutators(mutators, options) {
		mutators.resources = createResources;
	}
}

function createResources(input) {
	return input.map(resource => ({
		id: String(resource.id),
		title: resource.title || ''
	}));
}