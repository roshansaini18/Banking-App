const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors =require('cors');
const app = express();
// require routers files
const usersRouter = require('./routes/users.routes');
const uploadRoter = require('./routes/upload.routes');
const emailRouter = require('./routes/send-email-routes');
const brandingRouter = require('./routes/branding.routes');
const branchRouter = require('./routes/branch.routes');
const currencyRouter = require('./routes/currency.routes');
const loginRouter = require('./routes/login.routes');
const verifyRouter=require('./routes/verify.routes');
const customersRouter=require('./routes/customers.routes');
const findByAccountRouter=require('./routes/findByAccount.routes');
const transactionRouter=require('./routes/transaction.routes');
const authRoutes = require('./routes/auth.routes.js');
const beneficiaryRoutes = require('./routes/beneficiary.routes');
const transferRoutes = require('./routes/transfer.routes');
const cardRoutes = require('./routes/card.routes');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(
  cors({
    origin: [   
      "http://localhost:8080",
        "https://s-o-bank.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route level middleware
app.use("/api/users",usersRouter);
app.use("/api/upload",uploadRoter);
app.use("/api/send-email",emailRouter);
app.use("/api/branding",brandingRouter);
app.use("/api/branch",branchRouter);
app.use("/api/currency",currencyRouter);
app.use("/api/login",loginRouter);
app.use("/api/verify-token",verifyRouter);
app.use("/api/customers",customersRouter);
app.use("/api/find-by-account",findByAccountRouter);
app.use("/api/transaction",transactionRouter);
app.use('/api/auth', authRoutes);   
app.use('/api/beneficiaries', beneficiaryRoutes);  
app.use('/api/transfers', transferRoutes);   
app.use('/api/cards', cardRoutes);   
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports=app;
