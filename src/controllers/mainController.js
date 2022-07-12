const db = require('../database/models');
const {Op} = require('sequelize')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		let productsVisited = db.Product.findAll({
			where : {
				discount : {
					[Op.lt] : 20
				}
			},
			order : [['id','DESC']],
			limit : 4,
			include : ['images']
		})
		let productsInSale = db.Product.findAll({
			where : {
				discount : {
					[Op.gte] : 20
				}
			},
			include : ['images']
		})
		Promise.all([productsVisited,productsInSale])
			.then(([productsVisited,productsInSale]) => {
				return res.render('index',{
					productsVisited,
					productsInSale,
					toThousand
				})
			})
			.catch(error => console.log(error))
	},
	
};

module.exports = controller;
