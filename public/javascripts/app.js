var abookApp = angular.module('abook', []);

abookApp.filter('contactSearch', function(){
	return function(item){
		console.log('From filter');
		console.dir(item);
		return item;
	};
});

abookApp.factory('dataSource', function($http){
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
});

abookApp.controller('BookController', function BookController($scope, dataSource){
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

});
