'use strict'
function showContent() {
    localStorageData();

    createElement('<button/>', '.todolist', 'btnAddItem', 'Add new note', 'btnNewNote');
    $('#btnAddItem').click(handleAddNewItem);

    createElement('<button/>', '.todolist', 'btnShowNotes', 'Show notes', 'btnShowNotes');
    $('#btnShowNotes').click(handleShowNotes);
}

function handleShowNotes() {
    deleteContent();
    const noteArr = JSON.parse(localStorage.getItem('notes'));

    for(let i = 0; i < noteArr.length; i++) {
        createElement('<div/>', '.todolist', `noteItem${i}`, '', 'note');
        createElement('<h2/>', `#noteItem${i}`, `noteTitle${i}`, noteArr[i].text);
        createElement('<p/>', `#noteItem${i}`, `notePriority${i}`, noteArr[i].priority);
        createElement('<p/>', `#noteItem${i}`, `noteStatus${i}`,`Status: ${noteArr[i].status}`);

        const get = url => fetch(url).then(res => res.json());

        get('js/data.json').then(data => {
            const getEntityFromPayload = (payload, predicate) => {
                return payload.find(function(entry) {
                   return entry === predicate;
                });
              };
              
            const checkStatus = getEntityFromPayload(data.statuses, noteArr[i].status);
            const checkPriority = getEntityFromPayload(data.priorities, noteArr[i].priority);

            if(!checkPriority) {
                $(`#notePriority${i}`).text('Not defined'); /// or res.priorities[0] 
            }

            if(!checkStatus) {
                $(`#noteStatus${i}`).text('Not defined'); /// or res.priorities[0] 
            }
        });
        
        createElement('<button/>', `#noteItem${i}`, `noteEdit${i}`,'Edit' ,'btnEdit','','',[['data-idNote',noteArr[i].id], ['data-idNoteDiv',`#noteItem${i}`]]);
        createElement('<button/>', `#noteItem${i}`, `noteDelete${i}`,'' ,'btnDelete','','',[['data-idNote',noteArr[i].id], ['data-idNoteDiv',`#noteItem${i}`]]);
    }
    
    $('.btnEdit').click(handleEditNote);
    $('.btnDelete').click(handleDeleteNote);
}

function handleEditNote() {
    const idNote = event.target.getAttribute('data-idnote');
    const notesArr = JSON.parse(localStorage.getItem('notes'));
    const idNoteDiv = event.target.getAttribute('data-idNoteDiv');

    // не уверен что правильно написал и есть ли смысл менять
    // const selectedNote = (notesArr) => {
    //     notesArr.find(function(noteItem)) {
    //         return noteItem.id === idNote;
    //     }
    // }       
    
    const selectedNote = notesArr.find(function (noteItem) {
        return noteItem.id === idNote;
    });
    
    editNote(idNoteDiv,selectedNote);
}

function editNote(idNoteDiv,selectedNote) {
    handleShowNotes();
    $(idNoteDiv).text('');
    $(idNoteDiv).addClass('editBlock');

    let regDivId = /\d/;
    const divId = idNoteDiv.match(regDivId);

    createElement('<h2/>',`#noteItem${divId[0]}`, 'newNoteTitle', 'Edit note');
    createElement('<input/>',`#noteItem${divId[0]}`, 'noteName', '', 'noteInput', 'Enter note');
    createElement('<select/>',`#noteItem${divId[0]}`, 'noteSelectPriority', '', 'noteInput');
    createElement('<select/>',`#noteItem${divId[0]}`, 'noteSelectStatus', '', 'noteInput');
       
    const get = url => fetch(url).then(res => res.json());

    get('js/data.json').then(res => {
        for(let i = 0; i < res.statuses.length; i++) {
            createElement('<option/>','#noteSelectStatus', `noteOption${i}`, res.statuses[i], 'noteInput', '', res.statuses[i]);
        }  

        for(let i = 0; i < res.priorities.length; i++) {
            createElement('<option/>','#noteSelectPriority', `noteOption${i}`, res.priorities[i], 'noteInput', '', res.priorities[i]);
        }
    });

    createElement('<button/>', `#noteItem${divId[0]}`, 'btnSave', 'Save', '','','',[
        ['data-idNote', selectedNote.id], 
        ['data-idNoteDiv', idNoteDiv]
    ]);
    createElement('<button/>', `#noteItem${divId[0]}`, 'btnBack', 'Back', 'btnOk');
    $('#btnSave').click(handleSaveNote);
    $('#btnBack').click(handleShowNotes);
}

function handleSaveNote() {
    const idNote = event.target.getAttribute('data-idnote');
    const notesArr = JSON.parse(localStorage.getItem('notes'));
    
    const selectedNote = notesArr.find(function (noteItem) {
        return noteItem.id === idNote;
    });

    const indexElement = notesArr.indexOf(selectedNote);

    selectedNote.priority = $('#noteSelectPriority').val();
    selectedNote.status = $('#noteSelectStatus').val();

    if($('#noteName').val() === '') {
        selectedNote.text;
    } else {
        selectedNote.text = $('#noteName').val();
    }

    notesArr.splice((indexElement),1,selectedNote);
    localStorage.setItem('notes',JSON.stringify(notesArr));
    handleShowNotes();
}

function handleDeleteNote() {
    const idNote = event.target.getAttribute('data-idnote');
    const notesArr = JSON.parse(localStorage.getItem('notes'));
    const idNoteDiv = event.target.getAttribute('data-idNoteDiv');
    
    const selectedNote = notesArr.find(function (noteItem) {
        return noteItem.id === idNote;
    });
    
    confirmDeleteNote(idNoteDiv, selectedNote);
}

function confirmDeleteNote(idNoteDiv,selectedNote) {
    handleShowNotes();
    $(idNoteDiv).text('');
    $(idNoteDiv).addClass('confirmBlock');

    createElement('<h2/>', idNoteDiv, 'confirmTitle', 'Delete note?');
    createElement('<button/>', idNoteDiv, 'btnYes', 'Yes','','','',[
        ['data-idNote', selectedNote.id], 
        ['data-idNoteDiv', idNoteDiv]
    ]);
    createElement('<button/>', idNoteDiv, 'btnNo', 'No');

    $('#btnYes').click(handleBtnYes);
    $('#btnNo').click(handleShowNotes);
}

function handleBtnYes() {
    const idNote = event.target.getAttribute('data-idnote');
    const notesArr = JSON.parse(localStorage.getItem('notes'));
    
    const selectedNote = notesArr.find(function (noteItem) {
        return noteItem.id === idNote;
    });

    console.log(selectedNote)

    const indexElement = notesArr.indexOf(selectedNote);
    notesArr.splice((indexElement),1);
    localStorage.setItem('notes',JSON.stringify(notesArr));
    handleShowNotes();
}

function handleAddNewItem() {
    deleteContent();
    createElement('<div/>', '.todolist', 'noteContent', '', 'noteContent');
    createElement('<h2/>','.noteContent', 'newNoteTitle', 'Add new note');
    createElement('<input/>','.noteContent', 'noteName', '', 'noteInput', 'Enter note');
    createElement('<select/>','.noteContent', 'noteSelectPriority', '', 'noteInput');
    createElement('<select/>','.noteContent', 'noteSelectStatus', '', 'noteInput');

    const get = url => fetch(url).then(res => res.json());

    get('js/data.json').then(res => {
        for(let i = 0; i < res.statuses.length; i++) {
            createElement('<option/>','#noteSelectStatus', `noteOption${i}`, res.statuses[i], 'noteInput', '', res.statuses[i]);
        }

        for(let i = 0; i < res.priorities.length; i++) {
            createElement('<option/>','#noteSelectPriority', `noteOption${i}`, res.priorities[i], 'noteInput', '', res.priorities[i]);
        }
    });
       
    createElement('<button/>', '.noteContent', 'btnOk', 'OK', 'btnOk');
    $('#btnOk').click(handleAddNote);
}

function handleAddNote() {
    let check = 0;
    let checkNote = /\w{1,}/;

    if($('#noteName').val() === '' || $('#noteName').val().match(checkNote) === null) {
        $('#noteName').addClass('invalid');
    } else {
        $('#noteName').removeClass('invalid');
        check++
    }

    if(check === 1) {
        const notesArr = JSON.parse(localStorage.getItem('notes'));
        const newNote = new NewNote($('#noteName').val(), $('#noteSelectPriority').val(), $('#noteSelectStatus').val(), notesArr);
        
        notesArr.push(newNote);
        localStorage.setItem('notes',JSON.stringify(notesArr));
        handleShowNotes();
    }
    
}

function createElement(tag, parent, idElem, text, className, placeholder, value, attrArr) {
    $(tag,{
        id: idElem,
    }).appendTo($(parent))

    if(text) {
        $(`#${idElem}`).text(text);
    }

    if(className) {
        $(`#${idElem}`).addClass(className);
    }

    if(placeholder) {
        $(`#${idElem}`).attr('placeholder', placeholder);
    }

    if(value) {
        $(`#${idElem}`).val(value);
    }

    if(attrArr) {
        for(let i = 0; i < attrArr.length; i++) {
            $(`#${idElem}`).attr(attrArr[i][0], attrArr[i][1]);
        }
        
    }
}

function localStorageData() {
    const notesArr = localStorage.getItem('notes');

    if(!notesArr) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function deleteContent() {
    if($('.noteContent')) {
        $('.noteContent').remove();
    }
    if($('.note')) {
        $('.note').remove();
    }
}