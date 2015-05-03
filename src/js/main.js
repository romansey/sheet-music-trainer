import NoteRenderer from './lib/NoteRenderer';

window.onload = function () {
    let canvas = document.getElementById('sheet');
    let noteRenderer = new NoteRenderer(canvas);
    noteRenderer.renderNote(["e/5"]);
};
