import vexflow from "vexflow";

export default class NoteRenderer {

    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new vexflow.Flow.Renderer(this.canvas, vexflow.Flow.Renderer.Backends.CANVAS);
    }

    renderNote(keys, clef) {
        let ctx = this.renderer.getContext();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let stave = new vexflow.Flow.Stave(10, 0, 300);
        stave.addClef(clef)
            .addTimeSignature("1/4")
            .setContext(ctx).draw();

        let note = new vexflow.Flow.StaveNote({
            keys: keys,
            duration: "q",
            'auto_stem': true,
            clef: clef
        });

        keys.forEach(function (key, index) {
            switch (key.substr(1, 1)) {
                case '#':
                    note.addAccidental(index, new Vex.Flow.Accidental("#"));
                    break;
                case 'b':
                    note.addAccidental(index, new Vex.Flow.Accidental("b"));
                    break;
            }
        });

        let voice = new vexflow.Flow.Voice({
            'num_beats': 1,
            'beat_value': 4,
            resolution: vexflow.Flow.RESOLUTION
        });

        voice.addTickables([note]);

        let formatter = new vexflow.Flow.Formatter().joinVoices([voice]).format([voice], 500);

        voice.draw(ctx, stave);
    }

}
