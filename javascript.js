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
    const tambah_tugas = document.getElementById("tugas").value;
    const tambah_tanggal_berakhir = document.getElementById("tanggal").value+" "+thisTime();
    const tambah_keterangan = document.getElementById("keterangan").value;
    const tambah_tanggal_selesaikan = "";
    const todo_status = "";
    const data_todo = [tambah_tugas,tambah_tanggal_berakhir,tambah_keterangan,tambah_tanggal_selesaikan,todo_status];
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
            row.innerHTML += "<td>" + selisih_tgl(value[i][1],thisDate()) + "</td>";
            row.innerHTML += "<td><button onclick='selesai("+i+")' class='btn btn-success'>Selesaikan</button</td>";
        
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
            row.innerHTML += "<td>" + value_complite[j][3] + "</td>";
            row.innerHTML += "<td>" + value_complite[j][4] + "</td>";
            row.innerHTML += "<td><button onclick='hapus("+j+")' class='btn btn-danger'>Hapus</button</td>";
        
            todoCompliteList.appendChild(row);
        }

    }).catch(function(err) {
        console.log(err);
    });

}

function selesai(id){
    arr_todo = [];
    const selesai_tugas = arr_uncomplite_history[id][0];
    const selesai_tanggal_berakhir = arr_uncomplite_history[id][1];
    const selesai_keterangan = arr_uncomplite_history[id][2];
    const selesai_tanggal_selesaikan = thisDate()+" "+thisTime();
    let todo_status = "";
    const sisa_waktu = selisih_tgl(selesai_tanggal_berakhir,selesai_tanggal_selesaikan);

    if( sisa_waktu > 1){
        todo_status = "Lebih Awal";
    }else if(sisa_waktu <= 1 && sisa_waktu > 0){
        todo_status = "Tepat Waktu";
    }else{
        todo_status = "Terlambat";
    }
    
    data_todo = [selesai_tugas,selesai_tanggal_berakhir,selesai_keterangan,selesai_tanggal_selesaikan,todo_status];

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

function showTime() {
    let a_p = "";
    let today = new Date();
    let curr_hour = today.getHours();
    let curr_minute = today.getMinutes();
    let curr_second = today.getSeconds();
    if (curr_hour < 12) {
        a_p = "AM";
    } else {
        a_p = "PM";
    }
    if (curr_hour == 0) {
        curr_hour = 12;
    }
    if (curr_hour > 12) {
        curr_hour = curr_hour - 12;
    }
    curr_hour = checkTime(curr_hour);
    curr_minute = checkTime(curr_minute);
    curr_second = checkTime(curr_second);
    document.getElementById('clock').innerHTML=curr_hour + ":" + curr_minute + ":" + curr_second + " " + a_p;
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function thisDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    return year+"-"+checkTime(month)+"-"+checkTime(day);
}

function thisTime() {
    let today = new Date();
    let curr_hour = today.getHours();
    let curr_minute = today.getMinutes();
    let curr_second = today.getSeconds();
    return curr_hour+":"+checkTime(curr_minute)+":"+checkTime(curr_second);
}

function selisih_tgl(tgl1,tgl2){
    let miliday = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date(tgl1);
    let secondDate = new Date(tgl2);
    let selisih = (Date.parse(firstDate) - Date.parse(secondDate)) / miliday;

    if (selisih < 1){
        selisih = selisih;
    }else{
        selisih = Math.floor(selisih);
    }

    return selisih;
}

function selisih_tgl_txt(selisih){
    if(selisih > 1){
        return selisih +" Hari";
    }

    return selisih;
}

console.log(new Date());
setInterval(showTime, 500);