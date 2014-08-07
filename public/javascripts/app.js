
function BookController($scope){
    $scope.query = "";
	
	var sesId = 'aa';
	var counter = 0;
	var _selectedCollection = {};
	
	$scope.book = [{
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
		id: 'aa_34'
	}].map(function(item){
		item.activeClass = "";
		return item;
	});
	
	$scope.addNew = function(){
		$scope.book.push({
			name: Math.random(),
			tel: Math.random(),
			id: 'aa_' + counter++
		});	
	};
	$scope.editSelected = function(){
		console.log('Edit');
	};
	$scope.removeSelected = function(){
		console.log('Delete');
	};
	$scope.select = function(item){
		if(item.activeClass == '__selected'){
			item.activeClass = '';
			delete _selectedCollection[item.id];
		}else{
			item.activeClass = '__selected';
			_selectedCollection[item.id] = 1;
		}
	};
}