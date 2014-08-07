
function BookController($scope){
    $scope.query = "";
	
	var sesId = 'aa';
	var counter = 0;
	var _SEL_CLASS = '__selected';
	
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
		
		for(var i = 0, len = $scope.book.length; i < len; i++){
			if($scope.book[i].activeClass == _SEL_CLASS){
				$scope.book[i].name = Math.random();
				$scope.book[i].tel = Math.random();
				break;
			}
		}
		
	};
	$scope.removeSelected = function(){
		console.log('Delete');
				
		for(var i = $scope.book.length - 1; i >= 0; i--){
			if($scope.book[i].activeClass == _SEL_CLASS){
				$scope.book.splice(i, 1);
			}
		}
	};
	$scope.select = function(item){
		if(item.activeClass == _SEL_CLASS){
			item.activeClass = '';
		}else{
			item.activeClass = _SEL_CLASS;
		}
	};
}