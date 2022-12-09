//funciones js para el modulo de usuarios

const urlApi1 = "http://localhost:8080";//colocar la url con el puerto

function listarcategorias(){
    validaToken();
    $("#table_usuario").hide();
    $("#table_article").hide();
    $("#table_categoria").show();
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
                    <th scope="row">${categoria.id_ctg}</th>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                   
                </tr>  `;
                
            }
            document.getElementById("listarCategorias").innerHTML = categorias;
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
                <h1 class="display-5"><i class="fa-solid fa-circle-plus"></i> Registrar Categoria</h1>
            </div>
              
            <form action="" method="post" id="myForm1">
            <input type="hidden" name="id_ctg" id="id_ctg">

            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" name="nombre" id="nombre" required> <br>

            <label for="descripcion"  class="form-label">Descripcion</label>
            <input type="text" class="form-control" name="descripcion" id="descripcion" required> <br>

                <button type="button" class="btn btn-outline-info" onclick="registrarCategoria()">Registrar</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            document.getElementById("exampleModalLabel2").innerHTML = "Gestión de categorias";
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
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
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
   
      listarcategorias();
      alertas("Se ha registrado la categoria exitosamente!",1)
    
      
    
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
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

 

function validaToken(){
    if(localStorage.token == undefined){
        exit();
    }
}