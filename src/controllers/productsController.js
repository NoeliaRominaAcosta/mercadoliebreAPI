
const db = require("../database/models");
const { Op } = require("sequelize");
const {getURL,checkId,checkIDCategory} = require('../helpers')


const controller = {
  // Root - Show all products
  index: async (req, res) => {
    try {
      let products = await db.Product.findAll({
        include: ["images"],
      });
let response = {
	ok: true,
	meta : {
		status : 200,
    url : getURL(req),
		total : products.length
	},
	data: products
}
      return res.status(200).json(response)
	
    } catch (error) {
		console.log(error);
		return res.status(500).json({
			ok:false,
			msg : "comunique con el admin"
		})
	}
  },

  // Detail - Detail from one product
  detail: async(req, res) => {
   
  try {
    //comprueba que sea un id valido
    if(checkId(req.params.id)){
      let error = new Error('ID incorrecto')
      error.status(404)
      throw error
    }
    //busca producto
	let product = await db.Product.findByPk(req.params.id, {
		include: ["images"],
	  })
    //si no encuentra producto
    if(!product){
      let error = new Error('ID inexistente')
      error.status(404)
      throw error
    }
    //repuesta afirmativa
	  let response = {
		ok: true,
		meta : {
			url : getURL(req),//traerlo del tp de api en un helper
		},
		data: product
	}
	return res.status(200).json(response)		
  } catch (error) {
	console.log(error);
		return res.status(error.status || 500).json({
			ok:false,
      status : error.status || 500,
			msg :  error.message ? error.message : "comuniquese con el admin"
		})
  }
  },

  // Create -  Method to store
  store: async (req, res) => {
    const { title, price, discount, description, categoryId } = req.body;
try {
	if(!checkIDCategory(categoryId).ok){
    let error =await checkIDCategory(categoryId)
    console.log(error.msg);
    error = new Error(error.msg)
    error.status(404)
    throw error
  }
	let product = await db.Product.create({
		title: title.trim(),
		price: +price,
		discount: +discount,
		description: description.trim(),
		categoryId,
	  })
    let response = {
      ok: true,
      meta : {
        url :`${getURLbase(req)}`,
        //traerlo del tp de api en un helper porque aca no esta
        status :201,
        msg: "producto creado"
      },
      data: product
    }
    return res.status(200).json(response)	
	
			/* db.Image.bulkCreate(images, { validate: true }).then((result) =>
			  console.log(result)
			); */
		  
		 
		
} catch (error) {
	console.log(error);
		return res.status(error.status || 500).json({
			ok:false,
      status : error.status || 500,
			msg :  error.message ? error.message : "comuniquese con el admin"
		})
}
  },

  // Update - Method to update
  update: (req, res) => {
    const { title, price, discount, description, categoryId } = req.body;

    db.Product.update(
      {
        title: title.trim(),
        price: +price,
        discount: +discount,
        description: description.trim(),
        categoryId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(async () => {
        if (req.file) {
          try {
            await db.Image.update(
              {
                file: req.file.filename,
              },
              {
                where: {
                  productId: req.params.id,
                  primary: true,
                },
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
        return res.redirect("/products");
      })
      .catch((error) => console.log(error));
  },

  // Delete - Delete one product from DB
  remove: (req, res) => {
    db.Product.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((info) => {
        return res.redirect("/products");
      })
      .catch((error) => console.log(error));
  },
  recycle: (req, res) => {
    db.Product.findAll({
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
      paranoid: false,
      include: ["images"],
    })
      .then((products) =>
        res.render("recycle", {
          products,
          toThousand,
        })
      )
      .catch((error) => console.log(error));
  },
  restore: (req, res) => {
    db.Product.restore({
      where: {
        id: req.params.id,
      },
    })
      .then((info) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>", info);
        return res.redirect("/products");
      })
      .catch((error) => console.log(error));
  },
  search:async (req, res) => {
    const { keywords } = req.query;

  try {
    if(!keywords){
      let error = new Error('se necesita un keyword')
      error.status(404)
      throw error
    }
    let result = await db.Product.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: keywords,
            },
          },
          {
            description: {
              [Op.substring]: keywords,
            },
          },
        ],
      },
      include: ["images"],
    })
    if(!result.length){
      let response;

     response = {
        ok: true,
        meta : {
          status: 200,
          url : getURL(req),//traerlo del tp de api en un helper
          total: result.length,
          msg : "no hay resultado para" + keywords
        },
        data: result
      }
    }else{
       response = {
        ok: true,
        meta : {
          status: 200,
          url : getURL(req),//traerlo del tp de api en un helper
           total: result.length,
          msg : "resultado para" + keywords
        },
        data: result
      }
    }
    //repuesta afirmativa
	 
	return res.status(200).json(response)		
       
  } catch (error) {
    console.log(error);
		return res.status(error.status || 500).json({
			ok:false,
      status : error.status || 500,
			msg :  error.message ? error.message : "comuniquese con el admin"
		})
  }
  },
};

module.exports = controller;
