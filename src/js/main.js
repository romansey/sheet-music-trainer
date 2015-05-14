import NoteRenderer from './lib/NoteRenderer';
import * as Utils from './lib/Utils';

let messageTimeout;
let currentMidiChannel = 0;
let currentMidiDevice;
let noteRenderer;
let nextNote;

function displayMessage(text, isGood) {
    clearTimeout(messageTimeout);
    let messageParagraph = document.getElementById('message');
    messageParagraph.innerHTML = text;
    if (isGood) {
        messageParagraph.className = 'positive';
    } else {
        messageParagraph.className = 'negative';
    }
    messageTimeout = setTimeout(function () {
        messageParagraph.className = '';
    }, 5000);
}

function renderRandomNote() {
    let random = Math.floor(Math.random() * (85 - 60) + 60);
    nextNote = Utils.noteNumberToNote(random);
    console.log('Next note: ' + nextNote);
    noteRenderer.renderNote([nextNote]);
}

function midiMessageReceived(event) {
    var command = event.data[0] >> 4;
    var channel = event.data[0] & 0b1111;
    var noteNumber = event.data[1];
    var velocity = 0;
    if (event.data.length > 2) {
        velocity = event.data[2];
    }

    if ((currentMidiChannel === 0 || currentMidiChannel === channel) && command === 9 && velocity > 0) {
        let note = Utils.noteNumberToNote(noteNumber);
        console.log('Note pressed: ' + note);
        if (note === nextNote) {
            displayMessage('Good!', true);
            renderRandomNote();
        } else {
            displayMessage('Nope!', false);
        }
    }
}

window.onload = function () {
    let canvas = document.getElementById('staff');
    let selectInput = document.getElementById('input');
    let selectChannel = document.getElementById('channel');

    noteRenderer = new NoteRenderer(canvas);

    window.navigator.requestMIDIAccess().then(function (midi) {
        midi.inputs.forEach(function(input, id) {
            let newOption = document.createElement('option');
            newOption.value = id;
            newOption.innerHTML = input.name;
            selectInput.appendChild(newOption);
        });
    }, function (error) {
        console.log('Oh no: ' + error);
    });

    selectInput.addEventListener('change', function () {
        if (currentMidiDevice && currentMidiDevice.connection === 'open') {
            currentMidiDevice.close();
            currentMidiDevice = undefined;
        }
        window.navigator.requestMIDIAccess().then(function (midi) {
            midi.inputs.forEach(function(input, id) {
                if (input.id === selectInput.value) {
                    currentMidiDevice = input;
                    input.addEventListener('midimessage', midiMessageReceived);
                    input.open();
                }
            });
        }, function (error) {
            console.log('Oh no: ' + error);
        });
    });

    selectChannel.addEventListener('change', function () {
        currentMidiChannel = parseInt(this.value);
    });

    renderRandomNote();

};
