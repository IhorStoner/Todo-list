const notes = [
    {
        id: '0',
        text: 'Do homework',
        priority: 'High priority',
        status: 'Done',
    },
];

function NewNote(text, priority, status, arr) {
    if(arr.length === 0) {
        this.id = '0';
    }

    for(let i = 0; i < arr.length; i++) {
        this.id = `${arr.length + 1}`;

        if(this.id === arr[i].id || arr.length === 0) {
            this.id++;
        }
    }
    this.text = text;
    this.priority = priority;
    this.status = status;
}