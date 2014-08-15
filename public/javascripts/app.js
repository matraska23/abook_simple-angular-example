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

// Widget for modal dialogues - popup
abookApp.controller('popups', ['$scope', '$element', 'popupBus', function ($scope, $element, $popups) {
	$scope.collection = [];
	
	// create new popup by signal from popupBus
	$popups.subscribe('add', function(conf){
		$scope.collection.push(conf);
	});
	
	// to close popup
	$scope.closePopup = function(popupData){
		var pos = $scope.collection.indexOf(popupData);
		
		if(~pos){
			$scope.collection.splice(pos, 1);
		}
	}
}]);

// Popup wrapper (get content from controller)
abookApp.directive('abookPopupWrap', function ($compile) {
//	`content` and `config` attributes would be shared to child directives!
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			'close': '&onClose',
			'content': '=content',
			'config': '=config',
		},
		template: '<div ><div ng-click="close()">[X]</div></div><div data-co="inner"></div>',
		link: function (scope, elem, attr){
			var contentSource = $compile(scope.content)(scope);
			var inner = elem[0].querySelector('[data-co=inner]');
			
			if(inner && contentSource[0]){
				inner.appendChild(contentSource[0]);
			}
			// also can listen on `elem`
			// scope.$on('$destroy', function(){
				// // ...
			// });
		}
	}
});

abookApp.directive('editDialog', function($compile){
	return {
		restrict: 'EA',
		transclude: true,
		scope: {
			
		},
		template: 
			'<div class="">' +
				'<form ng-submit="onsubmit($event)">' +
					'<div class="">Name*: <input type="text" class="" required data-co="name" value="{{name}}"/></div>' +
					'<div class="">Tel: <input type="text" class="" data-co="tel" value="{{tel}}"/></div>' +
					'<div class=""><button type="submit">{{button}}</button></div>' +
				'</form>' +
			'</div>',
		link: function ($scope, $elem, attr){
			var config = $scope.$parent.config; 
			// console.log('Edit dialog');
			// console.dir(config);
			// console.dir($elem);
			// window.d = $elem;
			// console.dir($elem.find('[type=submit]'));
			
			if(config.button){
				$scope.button = config.button;
			}
			
			if(config.name){
				$scope.name = config.name;
			}
			
			if(config.tel){
				$scope.tel = config.tel;
			}
			$scope.onsubmit = function(e){
				// console.log('HANDLE SUBMIT');
				// console.dir($scope.$parent);
				
				if(config.onsubmit){
					var 	nameInput = $4.fnd($elem[0], '[data-co=name]'),
							telInput = $4.fnd($elem[0], '[data-co=tel]'),
							name = nameInput && nameInput.value,
							tel = telInput && telInput.value;
							
					config.onsubmit(name, tel);
				}
				
				// TODO:
				// I don't know how to trigger event with bubbling on the parents
				// $scope.$parent.$parent.$parent.$emit('close');
				
				// use internal api to close popup:
				var popupData = $scope.$parent.$parent.popup;
				$scope.$parent.$parent.closePopup(popupData);
				
				e.preventDefault();
			};
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
		$popups.add({
			content: 
				'<div>' +
					'<edit-dialog ></edit-dialog>' +
				'</div>',
			config: {
				button: 'Add',
				onsubmit: function(name, tel){
				
					var contactData = {
						name: name,
						tel: tel,
					};
					
					dataSource.addContact(contactData, function(d){
						contactData.id = d.id;
						$scope.book.push(contactData);	
					});
				},
			}
		});
	};
	$scope.editSelected = function(){
		var editId;
		
		for(var i = 0, len = $scope.book.length; i < len; i++){
			if($scope.book[i].activeClass == _SEL_CLASS){
				editId = $scope.book[i].id;
				break;
			}
		}
		
		if(!editId){
			return;
		}
		
		$popups.add({
			content: 
				'<div>' +
					'<edit-dialog ></edit-dialog>' +
				'</div>',
			config: {
				button: 'Change',
				name: $scope.book[i].name,
				tel: $scope.book[i].tel,
				onsubmit: function(name, tel){
					var contactData = {
						name: name,
						tel: tel,
						id: editId
					};
				
					dataSource.updateContact(contactData, function(d){
						$scope.book[i].name = contactData.name;
						$scope.book[i].tel = contactData.tel;
					});
				},
			}
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
	
	// // Example of creating watcher:
	// $scope.$watch('query', function(curValue, prevValue, $s){
		// console.log('watch triggerede %s', curValue);
	// });
	
}]);
