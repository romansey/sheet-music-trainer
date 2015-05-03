import vexflow from "vexflow";

export default class NoteRenderer {

    constructor(canvas) {
        this.canvas = canvas;
    }

    renderNote(keys) {
        let renderer = new vexflow.Flow.Renderer(this.canvas, vexflow.Flow.Renderer.Backends.CANVAS);

        let ctx = renderer.getContext();
        let stave = new vexflow.Flow.Stave(10, 0, 500);
        stave.addClef("treble")
            .addTimeSignature("4/4")
            .setContext(ctx).draw();

        let notes = [
            new vexflow.Flow.StaveNote({keys: keys, duration: "q", 'auto_stem': true}),
            new vexflow.Flow.StaveNote({keys: keys, duration: "q", 'auto_stem': true}),
            new vexflow.Flow.StaveNote({keys: keys, duration: "q", 'auto_stem': true}),
            new vexflow.Flow.StaveNote({keys: keys, duration: "q", 'auto_stem': true})
        ];

        let voice = new vexflow.Flow.Voice({
            'num_beats': 4,
            'beat_value': 4,
            resolution: vexflow.Flow.RESOLUTION
        });

        voice.addTickables(notes);

        let formatter = new vexflow.Flow.Formatter().joinVoices([voice]).format([voice], 500);

        voice.draw(ctx, stave);
    }

}
