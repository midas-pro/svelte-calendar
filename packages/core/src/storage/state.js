import {writable} from 'svelte/store';
import {is_function, tick, noop, identity} from 'svelte/internal';
import {createOptions, createParsers} from './options';
import {currentRange, activeRange, events, viewTitle, viewDates, view} from './stores';
import {writable2, intl, intlRange} from '@event-calendar/common';
import {assign} from '@event-calendar/common';

export default class {
    constructor(plugins, input) {
        plugins = plugins || [];

        // Create options
        let options = createOptions(plugins);
        let parsers = createParsers(options, plugins);

        // Create stores for options
        for (let [option, value] of Object.entries(options)) {
            this[option] = writable2(value, parsers[option]);
        }

        // Private stores
        this._currentRange = currentRange(this);
        this._activeRange = activeRange(this);
        this._fetchedRange = writable({start: undefined, end: undefined});
        this._events = events(this);
        this._intlEventTime = intl(this.locale, this.eventTimeFormat);
        this._intlSlotLabel = intl(this.locale, this.slotLabelFormat);
        this._intlDayHeader = intl(this.locale, this.dayHeaderFormat);
        this._titleIntlRange = intlRange(this.locale, this.titleFormat);
        this._scrollable = writable(false);
        this._viewTitle = viewTitle(this);
        this._viewDates = viewDates(this);
        this._view = view(this);
        this._viewComponent = writable(undefined);
        // Interaction
        this._interaction = writable({});
        this._interactionEvents = writable([null, null]);  // drag, pointer
        this._draggable = writable(noop);
        this._classes = writable(identity);
        this._scroll = writable(undefined);

        // Let plugins create their private stores
        for (let plugin of plugins) {
            if ('createStores' in plugin) {
                plugin.createStores(this);
            }
        }

        if (input.view) {
            // Set initial view based on input
            this.view.set(input.view);
        }

        // Set options for each view
        let commonOpts = assign({}, options, input);
        parseOpts(commonOpts, this);
        let views = new Set([...Object.keys(options.views), ...Object.keys(input.views || {})]);
        for (let view of views) {
            let viewOpts = assign({}, options.views[view] || {}, input.views && input.views[view] || {});
            parseOpts(viewOpts, this);
            let opts = assign({}, commonOpts, viewOpts);
            // Change view component when view changes
            this.view.subscribe(newView => {
                if (newView === view) {
                    this._viewComponent.set(opts.component);
                    if (is_function(opts.viewDidMount)) {
                        tick().then(() => opts.viewDidMount(this._view.get()));
                    }
                }
            });
            for (let key of Object.keys(opts)) {
                if (this.hasOwnProperty(key) && key[0] !== '_') {
                    let {set, _set, ...rest} = this[key];

                    if (!_set) {
                        // Original set
                        _set = set;
                    }

                    this[key] = {
                        // Set value in all views
                        set: value => {opts[key] = value; set(value);},
                        _set,
                        ...rest
                    };

                    // Change value when view changes
                    this.view.subscribe(newView => {
                        if (newView === view) {
                            _set(opts[key]);
                        }
                    });
                }
            }
        }
    }
}

function parseOpts(opts, state) {
    for (let key of Object.keys(opts)) {
        if (state.hasOwnProperty(key) && key[0] !== '_') {
            if (state[key].parse) {
                opts[key] = state[key].parse(opts[key]);
            }
        }
    }
}