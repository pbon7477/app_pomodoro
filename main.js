let arr_tareas = [];
let tiempo = 0;
let cronometro = null;
let crono_descanso = null;
let actual = null;

const btnAgregar = document.querySelector('#btnAgregar');
const input_tarea = document.querySelector('#tarea');
const formulario = document.querySelector('#form');
const nombre_tarea = document.querySelector('#crono #nombre_tarea');


input_tarea.focus();


renderTiempo();

formulario.addEventListener('submit',(e)=>{
    e.preventDefault();

    if( input_tarea.value !== '' ){

        agregar_tarea( input_tarea.value );
        input_tarea.value = '';
        render_tarea();

    }else{
        nombre_tarea.textContent = 'Debe llenar el campo con el nombre de la tarea.';
        input_tarea.focus();
    }

});



//FUNCION AGREGAR TAREA
function agregar_tarea( valor ){

    //Comprobar si la tarea ya existe
    let tarea_existe = arr_tareas.filter( obj => obj.titulo == valor );
    
    if( tarea_existe.length > 0 ){
        
        nombre_tarea.innerHTML='<p style="color:red">El nombre de la tarea ya existe en la lista</p>';
        

        return;

    }else{
        
        //Si no existe, crea el objeto
        const nueva_tarea = {
         id: (Math.random() * 100).toString(35).slice(3),
         titulo: valor,
         completado:false
        }
        nombre_tarea.textContent='Tarea agregada a la lista';
        nombre_tarea.style.color="";
        arr_tareas.unshift( nueva_tarea );   
    }
}


// FUNCION PARA RENDERIZAR LA TAREA ASIGNADAS

function render_tarea(){

    let  element_html = arr_tareas.map( ( tarea )=>{

        return `
            <div class="tarea_asignada">
               <div>
               
               <span class="completada">
               ${ tarea.completado ? `<button  class="btnCompletada" disabled >Tarea realizada</button>` : `<button class="btnIniciar" data-id="${tarea.id}">Iniciar</button>` }  
               </span>
               <span class="titulo">
               ${tarea.titulo}
               </span>
               </div>

                                            
                <span>
                <button class="btnEliminar" data-id="${tarea.id}">X</button>
                </span>
                

            </div>
        `;
    });

    let lista_tareas =  document.querySelector('#lista_tareas');
    lista_tareas.innerHTML= element_html.join('');

    
    //SELECCIONAMOS TODOS LOS BOTONES Y LE AÑADIMOS EL EVENTO
    let botones_iniciar = document.querySelectorAll('#lista_tareas .btnIniciar');
    
    botones_iniciar.forEach( (btnIniciar)=>{
        btnIniciar.addEventListener('click',(e)=>{

            if(!cronometro){
                let id =  btnIniciar.getAttribute('data-id');                
                boton_inicio_accion(id);
                btnIniciar.classList.add('tareaEnProgreso');
                btnIniciar.textContent = '...En progreso...';

                // e.target.parentNode.parentNode.parentNode.children[1].children[0].setAttribute('disabled', true);               
              
            }
        
        });
    } );


    //BOTONES PARA ELIMINAR TAREA
    let btnsEliminar = document.querySelectorAll('#lista_tareas .btnEliminar');
    btnsEliminar.forEach( (btnEliminar) =>{
        btnEliminar.addEventListener('click',(e)=>{

            let id = btnEliminar.getAttribute('data-id');
            arr_tareas = arr_tareas.filter( tarea => tarea.id !== id );
            tiempo = 0;
            clearInterval(cronometro);
            clearInterval(crono_descanso);
            cronometro=null;
            crono_descanso=null;
            renderTiempo();
            render_tarea();
            verificar_tareas_realizadas();
        })
    } );
    

    input_tarea.focus();

}


function boton_inicio_accion( id ){
    tiempo = 60 * 25
    //tiempo = 5;
    actual = id;

    const tarea_indice = arr_tareas.findIndex( tarea => tarea.id == actual );

    nombre_tarea.textContent = arr_tareas[tarea_indice].titulo;
    renderTiempo();

    cronometro = setInterval( ()=>{
        tiempo_accion(id);
    },1000 );
    
}



//FUNCION TIEMPO ACCION

function tiempo_accion(id){
    tiempo--;
    renderTiempo();

    if( tiempo == 0 ){
        clearInterval( cronometro );
        tarea_realizada(id);

        cronometro = null;
        
        render_tarea();
        inicio_descanso();
    }
}

// FUNCION INICIO DEL DESCANSO
function inicio_descanso(){
    tiempo = 5 * 60;
    //tiempo = 3;
    nombre_tarea.textContent = '...tiempo de descanso...';


    document.querySelectorAll('#lista_tareas .btnIniciar').forEach( btn => btn.setAttribute('disabled', true) );


    renderTiempo();

    

    crono_descanso = setInterval( ()=>{
            tiempo_descanso_accion();
           
    },1000 );

}


//FUNCION PARA MANEJAR EL TIEMPO DE DESCANSO
function tiempo_descanso_accion(){
    tiempo--;
    renderTiempo();

    if( tiempo==0 ){
        clearInterval( crono_descanso );
        document.querySelectorAll('#lista_tareas .btnIniciar').forEach( btn => btn.removeAttribute('disabled') );
        nombre_tarea.textContent='';
        tiempo = null;
        verificar_tareas_realizadas();
    }
}


//FUNCION TAREA REALIZADA(modifica la clave completado a true )

function tarea_realizada(id){
    const indice_tarea = arr_tareas.findIndex( obj => obj.id == id );
    arr_tareas[indice_tarea].completado = true;
    
}


//FUNCION PARA RENDERIZAR EL TIEMPO
function renderTiempo(){

const divTiempo = document.querySelector('#tiempo');
const minutos = parseInt(tiempo / 60);
const segundos = parseInt( tiempo % 60);

divTiempo.textContent = `${ minutos < 10 ? '0':''}${minutos}:${segundos < 10 ?'0':''}${segundos}`;

}



//BOTON PARA VALIDAR QUE SE HAYAN COMPLETADO TODAS LAS TAREAS
document.querySelector('#btnVerificar').addEventListener('click',()=>{
    verificar_tareas_realizadas();
})

//FUNCION PARA VALIDAR QUE SE HAYAN COMPLETADO TODAS LAS TAREAS
function verificar_tareas_realizadas(){
       
    
    if(arr_tareas.length == 0){
        nombre_tarea.innerHTML = '<center>No hay tareas ingresadas.<br>Por favor ingrese las tareas a realizar.</center>';
        input_tarea.focus();
        return;
    }
    
    let completadas = arr_tareas.filter( tarea => tarea.completado == false );
    console.log(completadas);

    if( completadas.length > 0 ){
        nombre_tarea.textContent = 'Aún quedan tareas por realizar.'
    }else{
        nombre_tarea.textContent = 'Se han realizado todas las tareas.'
        input_tarea.focus();
    }

}


//FUNCION PARA VACIAR TODAS LAS TAREAS
document.querySelector('#btnVaciar').addEventListener('click',()=>{

    input_tarea.value= '';
    
    if( arr_tareas.length == 0 ){
        nombre_tarea.textContent = 'La lista de tareas esta vacía.';
        return;
    }


    arr_tareas.length=0;
    clearInterval(cronometro);
    clearInterval(crono_descanso);
    cronometro = null;
    crono_descanso = null;
    tiempo = 0;
    nombre_tarea.textContent="Ingrese las tareas a realizar."
    renderTiempo();
    render_tarea();
    
}); 

