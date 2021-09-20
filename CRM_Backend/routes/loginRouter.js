var express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/home', async (req,res) => {
    try {
      res.render('home');
    } catch (err) {
      console.log(err)
    } 
});
  

router.get('/login', async (req,res) => {
    try{
      res.render('login')
    } catch (err) {
      res.render(404)
    }
  });


router.post("/login", (req, res, next) => {
	passport.authenticate("customer-login", (err, user, info) => {
	  if (err) throw err;
	  if (!user) res.send(false);
	  else {
		req.logIn(user, (err) => {
		  if (err) throw err;
		  res.send("Successfully Authenticated");
		  console.log(req.user);
		});
	  }
	})(req, res, next);
  });


  router.post("/register", (req, res, next) => {
	passport.authenticate("customer-signup", (err, user, info) => {
	  if (err) throw err;
	  if (!user) res.send(false);
	  else {
		req.logIn(user, (err) => {
		  if (err) throw err;
		  res.send("Successfully Authenticated");
		  console.log(req.user);
		});
	  }
	})(req, res, next);
  });

router.post('/register', passport.authenticate('customer-signup', 
  (req, res) => {
  console.log('registered', req.user);
  var userInfo = {
    username: req.user.username
  };
  res.send(userInfo);
    }) 
  );

router.post('/logout',function(req,res){
    console.log("logging out..")
    req.logout();
    req.flash('');
    res.redirect('back');
})

module.exports = router;