const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = (products) => { 
	fs.writeFileSync(productsFilePath, JSON.stringify(products) ,{encoding : 'utf-8'})
}
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render("products", {
			products,
			toThousand

		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productId = req.params.id
		let product = products.find(product => product.id == productId)
		res.render("detail", {
			product,
			toThousand,
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {

		let lastId = products[products.length - 1].id

		let newProduct = { 
			id: lastId + 1,
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: req.file ? req.file.filename : 'default-image.png'

		}
		products.push(newProduct)

		writeJson(products)

		res.redirect("/products/")

	},

	// Update - Form to edit
	edit: (req, res) => {
		let productId = +req.params.id

		let productToEdit = products.find(product => product.id === productId)

		res.render('product-edit-form',{
			productToEdit,
		})
	},
	// Update - Method to update
	update: (req, res) => {
		
		const { name, price, category, description, discount} = req.body;
		
		const productsModify = products.map((product) => {
			if (product.id === +req.params.id) {
			  let productModify = {
				...product,
				name: name.trim(),
				price: +price,
				discount: +discount,
				category,
				description: description.trim(),
				image: req.file ? req.file.filename : product.image,
			  };
	
			  if (req.file) {
				fs.existsSync(`./public/image/products/${product.image}`) &&
				fs.unlinkSync(`./public/image/products/${product.image}`);
			  }
	
			  return productModify;
			}
			return product;
		  });
	
		writeJson(productsModify)

		res.redirect("/products")
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		let productId = +req.params.id
		products.forEach(product=>{
			if(product.id === productId){
				let productToDestroy = products.indexOf(product);
				products.splice(productToDestroy, 1)
			} 
		})

		writeJson(products)

		res.redirect("/products")

	}
};

module.exports = controller;