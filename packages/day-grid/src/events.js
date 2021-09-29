import {cloneDate, addDay, setMidnight, datesEqual} from '@event-calendar/common';
import {sortEventChunks} from '@event-calendar/common';

export function prepareEventChunks(chunks, hiddenDays) {
    if (!chunks.length) {
        return;
    }

    sortEventChunks(chunks);

    let longChunks = {};
    let prevChunk;
    for (let chunk of chunks) {
        let dates = [];
        let date = setMidnight(cloneDate(chunk.start));
        while (chunk.end > date) {
            if (!hiddenDays.includes(date.getUTCDay())) {
                dates.push(cloneDate(date));
                if (dates.length > 1) {
                    let key = date.getTime();
                    if (longChunks[key]) {
                        longChunks[key].push(chunk);
                    } else {
                        longChunks[key] = [chunk];
                    }
                }
            }
            addDay(date);
        }
        if (dates.length) {
            chunk.date = dates[0];
            chunk.days = dates.length;
            chunk.dates = dates;
            if (chunk.start < dates[0]) {
                chunk.start = dates[0];
            }
            if (setMidnight(cloneDate(chunk.end)) > dates[dates.length - 1]) {
                chunk.end = dates[dates.length - 1];
            }
        } else {
            chunk.date = setMidnight(cloneDate(chunk.start));
            chunk.days = 1;
            chunk.dates = [chunk.date];
        }

        if (prevChunk && datesEqual(prevChunk.date, chunk.date)) {
            chunk.prev = prevChunk;
        }
        prevChunk = chunk;
    }

    return longChunks;
}
