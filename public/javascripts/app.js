var abookApp = angular.module('abook', []);

abookApp.filter('contactSearch', function(){
	return function(items, query){
		
		if(Array.isArray(items) && query){
			var 	res,
					regExp = new RegExp(query, 'i');
			
			res = items.filter(function(item){
				return regExp.test(item.name) ||  regExp.test(item.tel);
			});
			return res;
		}else{
			return items;
		}
	};
});

abookApp.factory('dataSource', ['$http', function($http){
	return {
		getContactList: function(onReady){
			$http({
				method: 'GET', 
				url: '/load/'
			}).
				success(function(data, status, headers, config) {
					onReady(data);
				}).
				error(function(data, status, headers, config) {
					console.log(status);
				});
		},
		addContact: function(conf, onReady){
			$http({
				method: 'POST', 
				url: '/add/',
				data: conf
			}).
				success(function(data, status, headers, config) {
					onReady(data);
				}).
				error(function(data, status, headers, config) {
					console.log(status);
				});
		},
		deleteContacts: function(idList, onReady){
			$http({
				method: 'POST', 
				url: '/delete/',
				data: {
					id: idList
				}
			}).
				success(function(data, status, headers, config) {
					onReady(data);
				}).
				error(function(data, status, headers, config) {
					console.log(status);
				});
		
		},
		updateContact:  function(conf, onReady){
			$http({
				method: 'POST', 
				url: '/update/',
				data: conf
			}).
				success(function(data, status, headers, config) {
					onReady(data);
				}).
				error(function(data, status, headers, config) {
					console.log(status);
				});
		
		}
	};
}]);
abookApp.factory('popupBus', function(){
	var _id = 0;
	return {
		_handlers: {},
		add: function(conf){
			console.log('Add');
			//this._stack[++_id] = conf;
			var addHandlers = this._handlers['add'];
			
			if(Array.isArray(addHandlers)){
				for(var i = 0, len = addHandlers.length; i < len; i++){
					addHandlers[i](conf);
				}
			}
		},
		subscribe: function(eventName, cb){
			if(!Array.isArray(this._handlers[eventName])){
				this._handlers[eventName] = [];
			}
			
			this._handlers[eventName].push(cb);
		}
	};
});


abookApp.controller('popups', ['$scope', '$element', 'popupBus', function ($scope, $element, $popups) {
	console.log("Popup controller");
	console.dir($element);
	
	$popups.subscribe('add', function(conf){
		console.log('Triggered add');
		console.dir(conf);
		// TODO create new popup by dirrective
	});
	
}]);

// Main variant
abookApp.directive('abookPopup', function () {
	return {
		link: function (scope, elem, attr){
			scope.value = '[BBB]'; 
			elem.html('<div>{value}</div>');
		}
	}
});


abookApp.controller('BookController', ['$scope', 'dataSource', 'popupBus', function BookController($scope, dataSource, $popups){
    $scope.query = "";
	
	var _SEL_CLASS = '__selected';
	
	dataSource.getContactList(function(d){
		$scope.book = d.contacts.map(function(item){
			item.activeClass = "";
			return item;
		});
	});
	
	$scope.addNew = function(){
		var contactData = {
			name: Math.random(),
			tel: Math.random(),
		};
		
		dataSource.addContact(contactData, function(d){
			contactData.id = d.id;
			$scope.book.push(contactData);	
			
			$popups.add({
				onopen: function(){},
				onclose: function(){},
			});
		});
	};
	$scope.editSelected = function(){
		console.log('Edit');
		var conf = {
			name: Math.random(),
			tel: Math.random(),
		};
		
		for(var i = 0, len = $scope.book.length; i < len; i++){
			if($scope.book[i].activeClass == _SEL_CLASS){
				conf.id = $scope.book[i].id;
				break;
			}
		}
		
		if(!conf.id){
			return;
		}
		
		dataSource.updateContact(conf, function(d){
			$scope.book[i].name = conf.name;
			$scope.book[i].tel = conf.tel;
		});
		
	};
	$scope.removeSelected = function(){
		console.log('Delete');
		var 	idList = [],
				idHash = {};
				
		for(var i = $scope.book.length - 1; i >= 0; i--){
			if($scope.book[i].activeClass == _SEL_CLASS){
				//$scope.book.splice(i, 1);
				idList.push($scope.book[i].id);
				idHash[$scope.book[i].id] = i;
			}
		}
		
		if(!idList.length){
			return;
		}
		
		dataSource.deleteContacts(idList, function(d){
			for(var i = $scope.book.length - 1; i >= 0; i--){
				if(idHash[$scope.book[i].id] != undefined){
					$scope.book.splice(i, 1);
				}
			}
		});
	};
	$scope.select = function(item){
		if(item.activeClass == _SEL_CLASS){
			item.activeClass = '';
		}else{
			item.activeClass = _SEL_CLASS;
		}
	};
	

	// console.log('Scope');
	// console.dir($scope);
	
	// // Example of creating watcher:
	// $scope.$watch('query', function(curValue, prevValue, $s){
		// console.log('watch triggerede %s', curValue);
	// });
	
}]);
