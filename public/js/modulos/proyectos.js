import Swal from 'sweetalert2';
import axios from 'axios';

    const btnEliminar = document.querySelector('#eliminar-proyecto');

    if(btnEliminar){
        btnEliminar.addEventListener('click', e =>{
            //capturmos mediante el evento e la url del proyecto
            const urlProyecto = e.target.dataset.proyectoUrl;

            Swal.fire({
                title: 'Deseas borrar este proyecto?',
                text: "Un proyecto eliminado no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar!',
                cancelButtonText: 'No, Cancelar'
              }).then((result) => {             
                if (result.value) {

                  //enviar peticiones a axios
                  const url = `${location.origin}/proyectos/${urlProyecto}`;
                  
                  //método de axios para enviar la petición al servidor
                  axios.delete(url, { params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta)
                          Swal.fire(
                            'Proyecto eliminado!',
                            respuesta.data,
                            'success'
                          );
                          //redireccinamos al inicio
                          setTimeout(() => {
                                window.location.href = '/'
                          }, 3000)
                    })
                    .catch (() => {
                        Swal.fire({
                          type : 'error',
                          title : 'Hubo un error',
                          text : 'No se pudo eliminar el proyecto'
                        })
                    })
                }
              })
        })
    }
    export default btnEliminar;
 


