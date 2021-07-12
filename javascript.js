let num_data = 0;
let arr_history = [];
baca();
document.addEventListener("DOMContentLoaded", function () { 
    const submitForm = document.getElementById("form_todo");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        tambah();
    });
});

function tambah(){
    const tugas = document.getElementById("tugas").value;
    const tanggal = document.getElementById("tanggal").value;
    const keterangan = document.getElementById("keterangan").value;
    const data_todo = [tugas,tanggal,keterangan];
    arr_todo = [];
    
    if(num_data > 0 ){    
        arr_todo = arr_history;
        arr_todo.push(data_todo);
    }else{
        arr_todo.push(data_todo);
    }

    localforage.setItem('todo', arr_todo).then(function(value) {
        console.log(value);
        tampil();        
    }).catch(function(err) {
        console.log(err);
    });
}

function baca(){
    localforage.getItem('todo').then(function(value) {
        arr_history = value;
        num_data = value.length;
    }).catch(function(err) {
        console.log(err);
    });
}

function tampil(){
    localforage.getItem('todo').then(function(value) {
        const todoList = document.getElementById("baca");
        todoList.innerHTML = "";
 
        for (let val of value) {
            let row = document.createElement('tr');
            row.innerHTML = "<td>" + val[0] + "</td>";
            row.innerHTML += "<td>" + val[1] + "</td>";
            row.innerHTML += "<td>" + val[2] + "</td>";
        
            todoList.appendChild(row);
        }

    }).catch(function(err) {
        console.log(err);
    });
}

tampil();