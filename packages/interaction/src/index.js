import Interaction from './Interaction.svelte';
import Resizer from './Resizer.svelte';

export default {
	createOptions(options) {
		options.editable = false;
		options.eventStartEditable = true;
		options.eventDragMinDistance = 5;
		options.eventDragStart = undefined;
		options.eventDragStop = undefined;
		options.eventDrop = undefined;
		options.eventDurationEditable = true;
		options.eventResizeStart = undefined;
		options.eventResizeStop = undefined;
		options.eventResize = undefined;
		options.dragScroll = true;
		options.pointer = false;
		options.theme.draggable = 'ec-draggable';
		options.theme.ghost = 'ec-ghost';
		options.theme.preview = 'ec-preview';
		options.theme.pointer = 'ec-pointer';
		options.theme.resizer = 'ec-resizer';
		options.theme.dragging = 'ec-dragging';
		options.theme.resizingY = 'ec-resizing-y';
		options.theme.resizingX = 'ec-resizing-x';
	},

	createStores(state) {
		state._interaction.set({
			component: Interaction,
			resizer: Resizer
		});
	}
}
