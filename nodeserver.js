const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:4200', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
var app = express();
var nodemailer = require('nodemailer');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.raw());
app.use(cors(corsOptions));


// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//      res.header('Access-Control-Allow-Origin', "http://localhost:3000");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header( 'Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type');
//     next();
// }

// app.use(allowCrossDomain);

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'goatoo',
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err)
        console.log ('DB connection created successfully');
    else
        console.log ("error in db" + JSON.stringify(err, undefined, 2));
});
app.listen(3000, () => console.log  ('express is running'));

//get all customer datas  ex:/customer
app.get('/customer', (req, res) => {
    mysqlConnection.query('select * from customer', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});

//get particular customer using id ex:/customer/1
app.get('/customer/:id', (req, res) => {
    mysqlConnection.query('select * from customer where id=?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(req.params);
        else
            console.log (err);
    });
});

//delete an customer
app.delete('/customer/:id', (req, res) => {
    mysqlConnection.query('delete from customer where id=?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('deleted successfuly');
        else
            console.log (err);
    });
});

app.post('/addCustomer', (req, res) => {
    //insert an customer
    const val = req.body;
    var sql= "INSERT INTO customer (name, email,phone,password,address) VALUES (?,?,?,?,?)";
    mysqlConnection.query(sql,[val.name,val.email,val.phone,val.password,val.address] , (err, rows, fields) => {
        if (!err){
            res.send("inserted successfully");         
        }
        else
            console.log (err);
    });
});











// create delivery boy

app.post('/createDeliveryBoy', (req, res) => {
    const val = req.body;
    val.status = 'false';
    val.createdDate = new Date();
    var sql= "INSERT INTO deliveryboy (firstname, lastname,email,phonenumber,alternatenumber,age,gender,education,aadhar,profile,status,createdDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    mysqlConnection.query(sql,[val.firstname,val.lastname,val.email,val.phonenumber,val.alternatenumber,val.age,val.gender,val.education,val.aadhar,val.profile,val.status,val.createdDate] , (err, rows, fields) => {
        if (!err){
            res.send('true');
        }
        else
            console.log (err);
    });
});












app.post('/createBranchAdmin', (req, res) => {
    const val = req.body;
    val.status = 'false';
    val.createdDate = new Date();
    var sql= "INSERT INTO branchadmin (name, email,phonenumber,alternatenumber,branchname,address,gender,aadhar,profile,location,createdDate) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    mysqlConnection.query(sql,[val.name,val.email,val.phonenumber,val.alternatenumber,val.branchname,val.address,val.gender,val.aadhar,val.profile,val.location,val.createdDate] , (err, rows, fields) => {
        if (!err){
            res.send('true');
        }
        else
            console.log (err);
    });
});


//get all addproduct datas  ex:/addproduct
app.get('/getBranchAdminList', (req, res) => {
    mysqlConnection.query('select * from branchadmin', (err, rows, fields) => {
        if (!err){
            rows.sort(function(a,b){
            return new Date(b.createdDate) - new Date(a.createdDate);
        });
            res.send(rows);
        }
        else{
            console.log (err);
        }
    });
});

//get particular delivery Boy
app.get('/getbranchadmin/:id', (req, res) => {
    mysqlConnection.query('select * from branchadmin where id =?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});


app.get('/branchAdminExist/:id', (req, res) => {
    mysqlConnection.query('select * from branchadmin where phonenumber =?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(req.params);
        else
            console.log (err);
    });
});






//get all addproduct datas  ex:/addproduct
app.get('/getDeliveryBoyList', (req, res) => {
    mysqlConnection.query('select * from deliveryboy', (err, rows, fields) => {
        if (!err){
            rows.sort(function(a,b){
            return new Date(b.createdDate) - new Date(a.createdDate);
        });
            res.send(rows);
        }
        else{
            console.log (err);
        }
    });
});


app.get('/activateDeliveryBoy/:id', (req, res) => {
     mysqlConnection.query('UPDATE deliveryboy SET status = "1"  WHERE id=?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('success');
        else
            console.log (err);
    });
});

app.post('/updateDeliveryBoy',(req,res) => {
    const val = req.body;
    var query = 'UPDATE deliveryboy SET name=?, email=?,phonenumber=?,alternatenumber=?,branchname=?,address=?,gender=?,aadhar=?,profile=?,location=?, WHERE id=?';  
mysqlConnection.query(query,[val.name,val.email,val.phonenumber,val.alternatenumber,val.branchname,val.address,val.gender,val.aadhar,val.profile,val.location,val.id], (err, rows, fields) => {
        if (!err){
            res.send("updated successfully");           
        }
        else
            console.log (err);
    });
});


//get particular delivery Boy
app.get('/getdeliveryboy/:id', (req, res) => {
    mysqlConnection.query('select * from deliveryboy where id =?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(req.params.id);
        else
            console.log (err);
    });
});


app.get('/deliveryboyExist/:id', (req, res) => {
    mysqlConnection.query('select * from deliveryboy where phonenumber =?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(req.params);
        else
            console.log (err);
    });
});





//edit and update customer details
app.post('/editCustomer',(req,res) => {
    const val = req.body;
    var query = 'UPDATE customer SET name = ?, phone =?,password=?,address=? WHERE id=?';  
mysqlConnection.query(query,[val.name,val.phone,val.password,val.address,val.id], (err, rows, fields) => {
        if (!err){
            res.send("updated successfully");           
        }
        else
            console.log (err);
    });
});

//product

//get all addproduct datas  ex:/addproduct
app.get('/product', (req, res) => {
    mysqlConnection.query('select * from addproduct', (err, rows, fields) => {
        if (!err){
            rows.sort(function(a,b){
            return new Date(b.pdtCreatedDate) - new Date(a.pdtCreatedDate);
        });
            res.send(rows);
        }
        else{
            console.log (err);
        }
    });
});

//get particular addproduct using id ex:/addproduct/1
app.get('/addproduct/:id', (req, res) => {
    mysqlConnection.query('select * from addproduct where productID =?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(req.params);
        else
            console.log (err);
    });
});

//delete an addproduct
app.get('/deleteproduct/:id', (req, res) => {
    mysqlConnection.query('delete from addproduct where productID =?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});

//insert an addproduct
app.post('/addproduct', (req, res) => {
    const params = req.body
    mysqlConnection.query('INSERT INTO addproduct SET ?', params, (err, rows, fields) => {
        if (!err)
            res.send("inserted successfully");
        else
            console.log (err);
    });
});


// get category details
app.get('/getCategory', (req, res) =>{
    mysqlConnection.query('select * from category', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
})


// get sub category details

app.get('/getSubCategory', (req, res) =>{
    mysqlConnection.query('select * from subcategory', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});

// get particular subcategory by choose category id
app.get('/getSubCategorybyCatId/:id', (req, res) =>{
    mysqlConnection.query('select * from subcategory where catID =?', [req.params.id], (err, subcat, fields) => {
        if (!err)
            res.send(subcat);
        else
            console.log (err);
    });
});




// get overall product with category and subcategory

var categoryList = [];
var subCategoryList = []
var productList = [];
var productData = [];
app.get('/getProducts', (req, res) => {
    mysqlConnection.query('select * from category', (err, rows, fields) =>{
        if(!err){
            categoryList = rows;
        mysqlConnection.query('select * from subcategory', (errcategory, subCat, fields) => {
        if (!errcategory){
            subCategoryList = subCat;
            mysqlConnection.query('select * from addproduct', (errproduct, product, fields) => {
            if (!errproduct){
                productList = product;        
                    categoryList.forEach((cat,c) =>{
                        cat.subcategory = [];
                        subCategoryList.forEach((sub,s) =>{
                            if(cat.catID == sub.catID){
                                cat.subcategory.push(sub);
                                sub.product = [];
                                productList.forEach((pr,p) =>{
                                    if((cat.catID == pr.categoryID) && (sub.subCatID == pr.subcategoryID))
                                    {
                                        sub.product.push(pr);
                                    }
                                })
                            }
                        });
                    });
                    res.send(categoryList);
            }
            else{
                console.log (errproduct);
            }

            });

        }
        else{
            console.log (errcategory);
        }
        })
    }
        else{
            console.log (err);
        }
        
    })
});

// get product by category id
var subCategoryProducts = [];
var productByCategory = [];
app.get('/getCategoryProduct/:id', (req, res) => {
    mysqlConnection.query('select * from subcategory where catID =?', [req.params.id], (err, subCategoryProduct, fields) => {
        if (!err)
        {
            subCategoryProducts = subCategoryProduct;
            mysqlConnection.query('select * from addproduct where categoryID =?', [req.params.id], (errproduct, productCat, fields) => {
                            if (!errproduct){ 
                                productByCategory = productCat;
                                subCategoryProducts.forEach((sub,s) =>{
                                    sub.product = [];
                                    productByCategory.forEach((pr,p) =>{
                                        if(sub.subCatID == pr.subcategoryID)
                                        {
                                            sub.product.push(pr);
                                        }
                                    })
                                });
                               res.send(subCategoryProducts);
                            }
        });
            
        }
        else{
            console.log (err);
        }
    });
});


// get particular product details

app.get('/getProductDetails/:id', (req, res) => {

    mysqlConnection.query('select * from addproduct where productID =?', [req.params.id], (errprod, getProducts, fields) => {
        if(!errprod){
            res.send(getProducts);
        }
        // console.log (getProducts);
    })

})


//add to cart get details
app.get('/getCart', (req, res) =>{
    mysqlConnection.query('select * from addtocart', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});

//add to cart insert details
var temp=0;
var arr=[];
var tempProductArrayList = [];
app.post('/addCart', (req, res) => {
    //insert an cart
obj=Object.assign({}, req.body);
tempProductArrayList = req.body;
var date = new Date();
let values=tempProductArrayList.reduce((o,val)=>{
                    let ini=[];
                    ini.push(val.productName);
                    ini.push(val.productID);
                    ini.push(val.productDesc);
                    ini.push(val.categoryID);
                    ini.push(val.customerID);
                    ini.push(date);
                    ini.push(val.productQuantity);
                    ini.push(val.productPrice);
                    ini.push(val.totalPrice);
                    o.push(ini);
                    return o
              },[])
     // console.log    (values);
var sql = "INSERT INTO addtocart (productName,productID,productDesc,categoryID,customerID,createdDate,productQuantity,productPrice,totalPrice) VALUES ?";

mysqlConnection.query(sql, [values], function (err, result) { //pass values array (from above)  directly here
    if (err){ throw err;}
    else{ 
    console.log ("Number of records inserted: " + result.affectedRows);
    res.send(true);
    productCountValue(tempProductArrayList);
    }
  });


});
function productCountValue(tempProductArrayList){
    let values=tempProductArrayList.reduce((o,val)=>{
                    let ini=[];  
                    ini.push(val.productQuantity);    
                    ini.push(val.productID);                 
                                 
                    o.push(ini);
                    return o
              },[])
     for (var i = 0; i < values.length; i++) {
        var query = 'UPDATE addproduct SET productCount = productCount-? WHERE productID=?';  
  
        mysqlConnection.query(query,[values[i][0],values[i][1]], (err, rows, fields) => {
                if (!err){
                    console.log("product updated successfully");
                   
                }
                else
                    console.log (err);
            });
     }




}

// function orderEmailNotification()
// {
//          let transport = nodemailer.createTransport({
//             service:'gmail',
//             auth: {
//                user: 'facteuronline@gmail.com',
//                pass: 'Facteur@123'
//             }
//         });
//        console.log   (arr);
//       totalpricevalue=0;
//     var content_html='<table style="width:100%"  border = "1" cellpadding = "5" cellspacing = "5"><caption><h3>Product Details</h3></caption><tr> <th>Product Name</th><th>Product Count</th><th>Product Rate</th></tr>';
//     for (var i = 0; i < arr.length; i++) {
//         totalpricevalue +=arr[i].totalPrice;
//     content_html += '<tr><td>'+arr[i].productName+'</td><td>'+arr[i].productQuantity+'</td><td>'+arr[i].productPrice+'</td></tr>';
//     }
//     content_html +='<tr><td colspan="2" style="text-align:right;">Total Price</td><td>'+totalpricevalue+'</td></tr></table>';

//         const message = {
//             from: 'facteuronline@gmail.com', // Sender address
//             to: ['facteuronline@gmail.com','deivapandi18@gmail.com'],         // List of recipients
//             subject: 'Goatoo Order Placed Successfully', // Subject line
//             html: content_html
//         };
//         transport.sendMail(message, function(err, info) {
//             if (err) {
//               console.log    (err)
//             } else {
//               console.log    (info);
//             }
//         });


// }

//get particular customer using id ex:/customer/1
app.get('/getCustomerProduct/:id', (req, res) => {
    mysqlConnection.query('select * from addtocart where customerID=?', [req.params.id], (err, rows, fields) => {
        if (!err){ 
        rows.sort(function(a,b){
            return new Date(b.createdDate) - new Date(a.createdDate);
        });
            res.send(rows);
        }
        else{ 
            console.log (err);
        }
    });
});



// wishlist save

app.post('/wishlist', (req, res) => {
    const val = req.body;
    var sql= "INSERT INTO wishlist (productID,customerID) VALUES (?,?)";
    mysqlConnection.query(sql,[val.productID,val.customerID] , (err, rows, fields) => {
        if (!err){
            res.send("Wishlist Added Successfully");        
        }
        else
            console.log (err);
    });
});


// delete wishlist

app.get('/deleteWishlist/:id', (req, res) => {
    mysqlConnection.query('delete from wishlist where productID=?', [req.params.id], (err, rows, fields) => {
        if (!err){
            res.send('true');
        }
        else
            console.log (err);
    });
});


var dataforwishlist = [];
var wishListdata = [];
app.get('/getWishlist/:id', (req, res) => {
    mysqlConnection.query('select * from addproduct', (err, rows, fields) => {
        if (!err){
    const val = req.body;
    dataforwishlist = rows;
   mysqlConnection.query('select * from wishlist where customerID=?',[req.params.id], (err, ro, fields) => {
        if (!err){
            sendWishlist = [];
                wishListdata = ro;
            dataforwishlist.forEach(product =>{
                    wishListdata.forEach(wish => {
                        if(product.productID == wish.productID){
                            product.customerID = wish.customerID
                            sendWishlist.push(product);
                        }
                    })
            })
            res.send(sendWishlist);
        }
        else{ 
            console.log (err);
        }
    });
}

})
});

// create category

app.post('/createCategory', (req, res) => {
    const val = req.body;
    var sql= "INSERT INTO category (catName) VALUES (?)";
    mysqlConnection.query(sql,[val.catName] , (err, rows, fields) => {
        if (!err){
            res.send("true");
        }
        else
            console.log (err);
    });
});


// related product get
app.get('/getRelatedProductsList/:id', (req, res) => {
    mysqlConnection.query('select * from addproduct where subcategoryID=?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});



// create sub category

app.post('/createSubCategory', (req, res) => {
    const val = req.body;
    var sql= "INSERT INTO subcategory (catID,subCatName) VALUES (?,?)";
    mysqlConnection.query(sql,[val.catID,val.subCatName] , (err, rows, fields) => {
        if (!err){
            res.send("true");
        }
        else
            console.log (err);
    });
});



//check customer is exists or not
var isValid='';
app.post('/checkCustomer', (req, res) =>{
    var email = req.body.username;
    var password = req.body.password;
    var userArray = [];
     
    // var sql='SELECT * FROM customer WHERE name = ? AND password = ?';
    mysqlConnection.query('select * from customer where email =? AND password=?', [email,password], (errprod, user, fields) => {

        if(!errprod){
            isValid=user;
            userArray = user;
            // console.log (user.length);
            if(user.length==1){
                res.send(userArray);
            }
            else{
                res.send(userArray)
            }   
        }
    });   
});




//get all customer datas  ex:/customer
app.get('/location', (req, res) => {
    mysqlConnection.query('select * from location', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});



app.post('/addNewProduct', (req, res) => {
    // console.log("tested for bind");
    const val = req.body;
    var sql= "INSERT INTO addproduct ( categoryID,subcategoryID,productName,productImage,productCount,productWeight,productDescription,productRateSymbol,productRate,productOfferPercent,expiryDate,location,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    mysqlConnection.query(sql,[val.categoryID,val.subcategoryID,val.productName,val.productImage,val.productCount,val.productWeight,val.productDescription,val.productRateSymbol,val.productRate,val.productOfferPercent,val.expiryDate,val.location,val.status] , (err, rows, fields) => {
        if (!err){
            res.send('true');
            let transport = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 587,
            service:'gmail',
            auth: {
               user: 'facteuronline@gmail.com',
               pass: 'Facteur@123'
            }
        });
        const message = {
            from: 'facteuronline@gmail.com', // Sender address
            to: 'thamdeva@gmail.com',         // List of recipients
            subject: 'Goatoo Product Added '+val.productName+' Successfully', // Subject line
            text: 'Goatoo Product Added Successfully', // Plain text body
            html: '<table style="width:100%"  border = "1" cellpadding = "5" cellspacing = "5"><caption><h3>Product Details</h3></caption><tr> <th>Product Name</th><th>Product Count</th><th>Product Description</th><th>Product RateSymbol</th><th>Product Rate</th><th>Product OfferPercent</th></tr><tr><td>'+val.productName+'</td><td>'+val.productCount+'</td><td>'+val.productDescription+'</td><td>'+val.productRateSymbol+'</td><td>'+val.productRate+'</td><td>'+val.productOfferPercent+'</td></tr></table>'


        };
        transport.sendMail(message, function(err, info) {
            if (err) {
              console.log   (err)
            } else {
              console.log   (info);
            }
        });

        }
        else
            console.log ('error',err);
    });
    


});

app.post('/editProduct',(req,res) => {
    // console.log  ('editProduct',req.body)
    const val = req.body;
    var query = 'UPDATE addproduct SET productName = ?, productCount =?,productImage=?,productDescription=?,productRateSymbol=?,productRate=?,productOfferPercent=? WHERE productID=?';  

mysqlConnection.query(query,[val.productName,val.productCount,val.productImage,val.productDescription,val.productRateSymbol,val.productRate,val.productOfferPercent,val.productID], (err, rows, fields) => {
        if (!err){
            res.send("true");
           
        }
        else
            console.log (err);
    });


});


app.post('/changeProductStatus',(req,res) => {
    // console.log  ('editProduct',req.body)
    const val = req.body;
    console.log(val.status);
    console.log(val.productID);
    var query = 'UPDATE addproduct SET status = ? WHERE productID=?';  
mysqlConnection.query(query,[val.status,val.productID], (err, rows, fields) => {
        if (!err){
            res.send(rows);
           
        }
        else
            console.log (err);
    });


});








//forget password
app.get('/forgetPassword',(req,res) => {
    // console.log  ('editProduct',req.body)
    //  var email = req.body.username;
    // var password = req.body.password;
    var email='fdsfthamdeva@gmail.com';
  mysqlConnection.query('select * from customer where email =?', [email], (errprod, user, fields) => {
        if(!errprod){ 
            if(user.length==0){
                console.log ('Email not available',user);
            }  
            else{
                console.log ('Email available',user);
             let transport = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 587,
            service:'gmail',
            auth: {
               user: 'facteuronline@gmail.com',
               pass: 'Facteur@123'
            }
        });
        passHtml='<h3>Product Details</h3>'
        passHtml+='<div>Dear '+user[0].name+',Visit the link below to reset your password. If you do not understand why you are receiving this e-mail, it may be because somebody else has entered your e-mail address into our password reminder form. If so, you may ignore this message.</div>'
        passHtml+='http://localhost:4200/login'
        const message = {
            from: 'facteuronline@gmail.com', // Sender address
            to: email,         // List of recipients
            subject: 'Password Reset', // Subject line
            html: passHtml
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
              console.log   (err)
            } else {
              console.log   (info);
            }
        });      
                
                }
        }
        else{
            console.log ('email not available',user)
        }
      
    });


});   

//filter by date
app.get('/chart/:id', (req, res) => {
    // SELECT * FROM addproduct WHERE pdtCreatedDate='2021-04-01'
    mysqlConnection.query('SELECT * FROM addproduct WHERE pdtCreatedDate= ?', [req.params.id], (err, rows, fields) => {
// console.log(req.params.id);
        if (!err)
            res.send(rows);
        else
            console.log (err);
    });
});





