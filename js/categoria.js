//funciones js para el modulo de usuarios

const urlApi1 = "http://localhost:8090";//colocar la url con el puerto

function listarcategorias(){
    validaToken();
    $("#table_categoria").show();
    $("#table_usuario").hide();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi1+"/categorias",settings)
    .then(response => response.json())
    .then(function(data){
        
            var categorias = '';
            for(const categoria of data){
               
                categorias += `
                <tr>
                    <th scope="row">${categoria.id}</th>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                   
                </tr>  `;
                
            }
            document.getElementById("listar").innerHTML = usuarios;
    })
}


function alertas(mensaje,tipo){
    var color ="";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-'+color+' alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("alerta").innerHTML = alerta;
}

function registerCategoria(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Categoria</h1>
            </div>
              
            <form action="" method="post" id="myForm1">
            <input type="hidden" name="id" id="id">

            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" name="nombre" id="nombre" required> <br>

            <label for="descripcion"  class="form-label">Descripcion</label>
            <input type="text" class="form-control" name="descripcion" id="descripcion" required> <br>

                <button type="button" class="btn btn-outline-info" onclick="registrarCategoria()">Registrar</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalCategoria'))
            myModal.toggle();
}

async function registrarCategoria(){
    var myForm = document.getElementById("myForm1");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi1+"/categoria", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    if(localStorage.token == undefined){
        console.log(request.status);
        if(request.status=='201'){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Una categoria registrada exitosamente',
                showConfirmButton: false,
                timer: 1500
              })          
           
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                text: 'ingrese los datos de manera correcta',
                showConfirmButton: false,
                timer: 3000
              });
        }
    }else{
      listarUsuarios();
      alertas("Se ha registrado la categoria exitosamente!",1)
    }
    
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalCategoria')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function exit(){
    localStorage.clear();
    location.href = "index.html";
}

function validaToken(){
    if(localStorage.token == undefined){
        exit();
    }
}