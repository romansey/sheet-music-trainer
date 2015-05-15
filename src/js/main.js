import NoteRenderer from './lib/NoteRenderer';
import * as Utils from './lib/Utils';

let intendedHashChange = false;
let messageTimeout;
let currentMidiChannel = -1;
let currentMidiDevice;
let currentClef;
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
    let random;
    switch (currentClef) {
        case 'bass':
            random = Math.floor(Math.random() * (65 - 36) + 36);
            break;
        default:
            random = Math.floor(Math.random() * (85 - 57) + 57);
            break;
    }
    nextNote = Utils.noteNumberToNote(random);
    console.log('Next note: ' + nextNote);
    noteRenderer.renderNote([nextNote], currentClef);
}

function midiMessageReceived(event) {
    var command = event.data[0] >> 4;
    var channel = event.data[0] & 0b1111;
    var noteNumber = event.data[1];
    var velocity = 0;
    if (event.data.length > 2) {
        velocity = event.data[2];
    }

    if ((currentMidiChannel === -1 || currentMidiChannel === channel) && command === 9 && velocity > 0) {
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

function determineClef(selectClef) {
    let clefSet = false;
    if (window.location.href.indexOf('#') > -1) {
        let clef = window.location.href.split('#')[1];
        let option = document.querySelector('#clef option[value="' + clef + '"]');
        if (option) {
            selectClef.value = clef;
            currentClef = clef;
            clefSet = true;
        }
    }
    if (!clefSet) {
        let defaultValue = selectClef[0].value;
        selectClef.value = defaultValue;
        currentClef = defaultValue;
    }
}

window.onload = function () {
    let canvas = document.getElementById('staff');
    let selectInput = document.getElementById('input');
    let selectChannel = document.getElementById('channel');
    let selectClef = document.getElementById('clef');

    determineClef(selectClef);

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

    selectClef.addEventListener('change', function () {
        currentClef = this.value;
        intendedHashChange = true;
        window.location.hash = '#' + currentClef;
        renderRandomNote();
    });

    window.addEventListener('hashchange', function () {
        if (intendedHashChange) {
            intendedHashChange = false;
        } else {
            determineClef(selectClef);
            renderRandomNote();
        }
    });

    renderRandomNote();

};
