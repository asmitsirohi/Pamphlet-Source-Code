module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/");
      }
    },
  
    ensureGuest: function (req, res, next) {
        if(req.isAuthenticated()) {
            res.redirect('/');
        } else {
            return next();
        }
    },

    ensureAdmin: function(req, res, next) {
      if(req.user.role == 'admin') {
        return next();
      } else {
        res.redirect('/');
      }
    },

    ensureCoAdmin: function(req, res, next) {
      if(req.user.role == 'admin' || req.user.role == 'co-admin') {
        return next();
      } else {
        res.redirect('/');
      }
    }
  };
  