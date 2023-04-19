const userRouter = require('./user');
const productRouter = require('./product');
const productCategoryRouter = require('./productCategories');
const blogCategoryRouter = require('./blogCategories');
const blogRouter = require('./blog');
const brandRouter = require('./brand');


const { notFound, errHandler } = require('../middlewares/errHandler');

const initRoutes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
    app.use('/api/productcategory', productCategoryRouter);
    app.use('/api/blogcategory', blogCategoryRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/brand', brandRouter);


    app.use(notFound);
    app.use(errHandler);
}

module.exports = initRoutes;