'use strict';

const saveNote = document.querySelector('.save-notes');
const addNote = document.querySelector('.add-notes');
const cancelNote = document.querySelector('.cancel-notes');
const deleteNote = document.querySelector('i');
const textArea = document.querySelector('textarea');
const title = document.querySelector('.title');
const description = document.querySelector('.description');
const numberOfNotes = document.querySelector('.notes-number');
const form = document.querySelector('form');
const appBody = document.querySelector('body');

class Note {
    #title;
    #content;
    #date;

    constructor (title, content, date) {
        this.#title = title;
        this.#content = content;
        this.#date = date;
    }

    get title() {
        return this.#title;
    }

    get content() {
        return this.#content;
    }

    get date() {
        return this.#date;
    }
}

let count = 0;
let editingIndex = -1;
const notes = [];
let lastFocusedNote = null;

function createList() {
    const notesContainer = document.querySelector('.notes-container');
    notesContainer.setAttribute('class', 'notes-container');

    const notesPreview = document.createElement('li');
    notesPreview.setAttribute('class', 'first-note');
    notesPreview.setAttribute('data-index', count)

    const notesTitle = document.createElement('h3');
    notesTitle.setAttribute('class', 'note-title');
    notesTitle.textContent = truncateText(title.value, 30);

    const notesDescription = document.createElement('p');
    notesDescription.setAttribute('class', 'note-description');
    notesDescription.textContent = truncateText(description.value, 40);

    const notesTime = document.createElement('p');
    notesTime.setAttribute('class', 'note-time');
    notesTime.textContent = new Date().toDateString();

    const deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('class', 'fa-solid fa-trash');
    deleteIcon.addEventListener('click', () => deleteNotes(deleteIcon));
    notesContainer.append(notesPreview);
    notesPreview.append(notesTitle, notesDescription, notesTime, deleteIcon);

    newList();

    clearNote();

    numberOfNotes.textContent = printNotesNumber();
    notesPreview.addEventListener('click', noteClick )
}

function newList() {
    const note = new Note(title.value, description.value, new Date().toDateString());
    notes.push(note);
    count++
}

function noteClick() {
    if (lastFocusedNote) {
        lastFocusedNote.classList.remove('focused-note');
    }
    this.classList.add('focused-note');
    lastFocusedNote = this;
    const index = parseInt(this.getAttribute('data-index'), 10);
    openNoteForEditing(index);  
}

function validateNote() {
    if(title.value.trim() === '' && textArea.value.trim() === '') {
        return false;
    }
    return true;
}

function truncateText(text, maxlength) {
    return text.length > maxlength ? text.substring(0, maxlength) + '...' : text;
}

function printNotesNumber() {
    return `You have ${notes.length} notes saved`;
}

function clearNote() {
    title.value = '';
    description.value = '';
}

saveNote.addEventListener('click', () => {
    if(!validateNote()) {
        return;
    }
    saveOrUpdateNote();
    numberOfNotes.textContent = printNotesNumber();
});

function openNoteForEditing(index) {
    const note = notes[index];

    title.value = note.title;
    description.value = note.content;

    editingIndex = index;
}

function saveOrUpdateNote() {
    if (editingIndex !== -1) {
        notes[editingIndex] = new Note(title.value, description.value, new Date().toDateString());
        editingIndex = -1;  
    } else {
        createList();
    }

    numberOfNotes.textContent = `You have ${notes.length} notes saved`;
}

addNote.addEventListener('click', () => {
    clearNote();
    removeHighlight();
})

function deleteNotes(element) {
    //i got some help from chatgpt here with the 'closest' element which is used 
    // to get the index from the parent 'li' element
    const index = element.closest('li').getAttribute('data-index');
    const noteIndex = parseInt(index, 10);

    notes.splice(noteIndex, 1);
    numberOfNotes.textContent = printNotesNumber();
    element.closest('li').remove();
    const notesContainer = document.querySelector('.notes-container');
    const allNotes = notesContainer.querySelectorAll('li');
    allNotes.forEach((note, i) => {
        note.setAttribute('data-index', i);
    });
    clearNote();
}

function removeHighlight() {
    const notesContainer = document.querySelector('.notes-container');
    const allNotes = notesContainer.querySelectorAll('li');
    allNotes.forEach((note) => {
        note.classList.remove('focused-note');
    })

    lastFocusedNote = null;
}















