let num_data_uncomplite = 0;
let num_data_complite = 0;
let arr_complite_history = [];
let arr_uncomplite_history = [];
tampil();

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
    
    if(num_data_uncomplite > 0 ){    
        arr_todo = arr_uncomplite_history;
        arr_todo.push(data_todo);
    }else{
        arr_todo.push(data_todo);
    }

    localforage.setItem('todo_uncomplite', arr_todo).then(function() {
        tampil();
        clear_form();
    }).catch(function(err) {
        console.log(err);
    });
}

function tampil(){
    localforage.getItem('todo_uncomplite').then(function(value) {
        arr_uncomplite_history = value;
        num_data_uncomplite = value.length;
        const todoUncompliteList = document.getElementById("read_uncomplite");
        todoUncompliteList.innerHTML = "";
 
        for (let i = 0; i < value.length; i++) {
            let row = document.createElement('tr');
            row.innerHTML = "<td>" + value[i][0] + "</td>";
            row.innerHTML += "<td>" + value[i][1] + "</td>";
            row.innerHTML += "<td>" + value[i][2] + "</td>";
            row.innerHTML += "<td><button onclick='selesai("+i+")'>Selesaikan</button</td>";
        
            todoUncompliteList.appendChild(row);
        }

    }).catch(function(err) {
        console.log(err);
    });

    localforage.getItem('todo_complite').then(function(value_complite) {
        arr_complite_history = value_complite;
        num_data_complite = value_complite.length;
        const todoCompliteList = document.getElementById("read_complite");
        todoCompliteList.innerHTML = "";
 
        for (let j = 0; j < value_complite.length; j++) {
            let row = document.createElement('tr');
            row.innerHTML = "<td>" + value_complite[j][0] + "</td>";
            row.innerHTML += "<td>" + value_complite[j][1] + "</td>";
            row.innerHTML += "<td>" + value_complite[j][2] + "</td>";
            row.innerHTML += "<td><button onclick='hapus("+j+")'>Hapus</button</td>";
        
            todoCompliteList.appendChild(row);
        }

    }).catch(function(err) {
        console.log(err);
    });
}

function selesai(id){
    arr_todo = [];
    const tugas_selesai = arr_uncomplite_history[id][0];
    const tanggal_selesai = arr_uncomplite_history[id][1];
    const keterangan_selesai = arr_uncomplite_history[id][2];
    data_todo = [tugas_selesai,tanggal_selesai,keterangan_selesai];

    if(num_data_complite > 0 ){    
        arr_todo = arr_complite_history;
        arr_todo.push(data_todo);
    }else{
        arr_todo.push(data_todo);
    }

    localforage.setItem('todo_complite', arr_todo).then(function() {
        arr_uncomplite_history.splice(id,1);
        localforage.setItem('todo_uncomplite', arr_uncomplite_history).then(function() {
            tampil();
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
}

function hapus(id){
    arr_complite_history.splice(id,1);
        localforage.setItem('todo_complite', arr_complite_history).then(function() {
            tampil();
        }).catch(function(err) {
            console.log(err);
        });
}

function clear_form(){
    document.getElementById("tugas").value = "";
    document.getElementById("tanggal").value = "";
    document.getElementById("keterangan").value = "";
}