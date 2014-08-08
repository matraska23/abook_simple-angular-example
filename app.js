var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 8080; 

app.set('views', path.join(__dirname, 'views'));
app.engine('htm', require('uinexpress').__express); // underscore template for .htm
app.set('view engine', 'htm');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var router = express.Router();
router.get('/', function(req, res){         
    res.render('index.htm',{
		layout: 'layout.htm'
	});
});

var _helpers = {
	arrayToHash: function(list){
		var res = {};
		for(var i = 0, len = list.length; i < len; i++){
			res[list[i]] = i;
		}
		return res;
	}
};

var _contactModel = {
	list: [{
		name: 'aaa',
		tel: '123',
		id: 'aa_33'
	},{
		name: 'Геном Гермофродитович Дарвинский',
		tel: '1234',
		id: 'aa_34'
	},{
		name: 'ccc',
		tel: '12345',
		id: 'aa_35'
	}],
	init: function(){
		// todo
	},
	store: function(){
		// todo
	},
	count: 0,
	remove: function(idList){
		var 	idHash = _helpers.arrayToHash(idList),
				removeCount = 0;
	
		for(var i = this.list.length - 1; i >= 0; i--){
			if(idHash[this.list[i].id] != undefined){
				this.list.splice(i, 1);
				removeCount++;
			}
		}
		return removeCount;
	},
	add: function(name, tel){
		var id = ++this.count;
		
		this.list.push({
			id: id,
			name: name,
			tel: tel
		});
		
		return id;
	},
	update: function(id, name, tel){
		var updated = 0;
		for(var i = 0, len = this.list.length; i < len; i++){
			if(this.list[i].id == id){
				if(name){
					this.list[i].name = name;
				}
				if(tel != undefined){
					this.list[i].tel = tel;
				}
				updated++;
				break;
			}
		}
		return updated;
	}
};	
	

	
router.get('/load', function(req, res) {
	res.json({
		contacts: _contactModel.list
	});
});

router.post('/add', function(req, res) {
	var id = _contactModel.add(req.body.name, req.body.tel);
	
	res.json({
		id: id
	});
});

router.post('/delete', function(req, res) {
	var removeCount = _contactModel.remove(req.body.id);
		
	res.json({
		removed: removeCount
	});
});

router.post('/update', function(req, res) {
	var updateCount = _contactModel.update(req.body.id, req.body.name, req.body.tel);
		
	res.json({
		updated: updateCount
	});
});


app.use('/', router);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



/// error handlers

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.htm', {
            message: err.message,
            error: err,
			layout: 'layout.htm'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.htm', {
        message: err.message,
        error: {},
		layout: 'layout.htm'
    });
});

app.listen(port);
console.log('Start on post:' + port);
