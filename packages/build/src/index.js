import Calendar from '@event-calendar/core';
import DayGrid from '@event-calendar/day-grid';
import TimeGrid from '@event-calendar/time-grid';
import ResourceTimeGrid from '@event-calendar/resource-time-grid';
import 'whatwg-fetch';
import 'abort-controller/polyfill';

export default class extends Calendar {
    constructor(el, options) {
        options.plugins = options.plugins || [DayGrid, TimeGrid, ResourceTimeGrid];

        super(el, options);
    }
}
