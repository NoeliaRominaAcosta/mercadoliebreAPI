const db = require('../database/models')
const getURL = (req = request) => req.protocol + '://' + req.get('host') + req.originalUrl;

const checkId = (id) => {
    if (isNaN(id)) {
        //si es un numero
        return true
      }
      return false
}
const checkIDCategory = async(id) =>{
    try {
        let category = await db.Category.findByPk(id)
        if(!category){
            let error = new Error('categoria inexistente')
      error.status(404)
      throw error
        }
        return {
            ok : true
        }
      //si no devuelve nada, la categoria no existe   
    } catch (error) {
      console.log(error);
      return {
        ok : false,
        status : error.status || 500,
        msg : error.message ? error.message : "comuniquese con el administrador"
      }  
    }
  
}
module.exports = {
    checkId,
    getURL,
    checkIDCategory
}