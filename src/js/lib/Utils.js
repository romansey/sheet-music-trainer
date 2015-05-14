const NOTES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export function noteNumberToNote(noteNumber) {
    return NOTES[noteNumber % 12] + '/' + (Math.floor(noteNumber / 12) - 1).toString();
}
