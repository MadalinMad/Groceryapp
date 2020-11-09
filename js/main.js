
		Vue.component('shelf-item',{
			props: ['name'],
			template : "<div class='mad-grocery-item-content mad-shelf-item-content'><span><img v-bind:src='name.img'> </span><span>{{name.name.charAt(0).toUpperCase() + name.name.slice(1)}}</span>  </div>" 
		})

		Vue.component('grocery-item',{
			props: ['name'],
			template : "<div class='mad-grocery-item-content'><span><img v-bind:src='name.img'> </span> <span>{{name.name.charAt(0).toUpperCase() + name.name.slice(1)}}</span>    <span>{{name.expiration.getDate() + '-' + name.expiration.getMonth() + '-' +name.expiration.getFullYear()}}</span> </div>" 
		})

		var app3 = new Vue({
			el: '#mad-app',
			data:{
				primaryYello: '#FE3300',
				bagListsearchbar: '',
				fridgeListSearchBar:'',
				fridgeListSortState : 'asc',
				fridgeActiveOrder : "img/up.svg",
				activeType: "",
				seen : true,
				moving : null,
				dateHandler : new Date().toJSON(),
				visibleCat : "Fridge",
				singleMessage:{
					title: "",
					content: "",
					action: "Ok"
				},
				formData: {
					name: "",
					type: "",
					expiration : "",
					errors: []
				},
				bagList : [
					{id: 0, name : "mortadella", type : "salumi", expiration: expiresIn(14), img: 'img/salumi.svg'},
					{id: 1, name : "prosciutto crudo", type :"salumi", expiration: expiresIn(30), img: 'img/salumi.svg'},
					{id: 2, name : "birra", type : "bibite", expiration: expiresIn(60), img: 'img/bibite.svg'},
					{id: 3, name : "gorgonzola", type : "formaggi", expiration: expiresIn(4), img: 'img/formaggi.svg'},
					{id: 4, name : "pecorino", type : "formaggi", expiration: expiresIn(3), img: 'img/formaggi.svg'},
					{id: 5, name : "insalata fresca", type : "verdure", expiration: expiresIn(7), img: 'img/verdure.svg'},
					{id: 6, name : "sedano", type : "verdure", expiration: expiresIn(5), img: 'img/verdure.svg'},
					{id: 7, name : "peperoni", type : "verdure", expiration: expiresIn(8), img: 'img/verdure.svg'},
					{id: 8, name : "cola cola", type : "bibite", expiration: expiresIn(365), img: 'img/bibite.svg'},
					{id: 9, name : "vitello tonnato", type : "altro", expiration: expiresIn(15), img: 'img/altro.svg'},
				],				
				fridge:{
					shelves: [
						{id: 0, type: "Fridge", name:"Lista frigo", groceries : [], img: 'img/fridge.svg'},
						{id: 1, type: "Formaggi", name :"Formaggi", groceries: [], img: 'img/Formaggi.svg'},
						{id: 2, type: "Verdure", name :"Verdure", groceries: [], img: 'img/Verdure.svg'},
						{id: 3, type: "Salumi", name :"Salumi", groceries: [], img: 'img/Salumi.svg'},
						{id: 4, type: "Bibite", name :"Bibite", groceries: [], img: 'img/Bibite.svg'},
						{id: 5, type: "Altro", name :"Altro", groceries: [], img: 'img/Altro.svg'}
					]
				}
			},
			methods: {
				getCustomDate : function(offset){
					try{
						var d = new Date();
						d = d.setDate(d.getDate() + offset);
						return d;
					}
					catch (error){
						this.bagList = [];
						this.singleMessage.title = "Ops!";
						this.singleMessage.content = "Si è verificato un errore mentre era in corso la generazione di una data, per maggiori dettagli visitare la console";
						console.error(error.message)
						activateMessageForm();
					}
					
				},
				fullFridge : function(){
					try{
						var fullList = [];
						for (var i =0; i< this.fridge.shelves.length; i++){
							for(var j =0; j<this.fridge.shelves[i].groceries.length; j++){
								fullList.push(this.fridge.shelves[i].groceries[j]);
							}
						}
						return mergeSort(fullList, this.fridgeListSortState);
					}
					catch (error){
						this.bagList = [];
						this.singleMessage.title = "Ops!";
						this.singleMessage.content = "Si è verificato un errore mentre era in corso il render del frigo, per maggiori dettagli visitare la console";
						console.error(error.message)
						activateMessageForm();
					}
				},
				shelveAll : function(){
					try{
						for (var i = 0; i < this.bagList.length; i++){
							this.fridge.shelves[this.findShelfId(this.bagList[i].type)].groceries.push(this.bagList[i]);
						}
						this.bagList = [];
						this.singleMessage.title = "Fatto!";
						this.singleMessage.content ="Tutti gli alimenti sono stati riposti nel frigo all'interno del proprio scaffale di appartenenza";
						activateMessageForm();			
					}catch (error){
						this.singleMessage.title = "Ops!";
						this.singleMessage.content = "Si è verificato un errore mentre gli alimenti venivano spostati nel frigo, per maggiori dettagli visitare la console";
						console.error(error.message)
						activateMessageForm();
					}
				},
				 findShelfId: function(type){
				 	try{
				 		for (var i = 0; i < this.fridge.shelves.length; i++){
					 		if (this.fridge.shelves[i].type.toLowerCase() == type.toLowerCase()){
					 			return i;
					 		}
					 	}
				 	} catch (error){
						this.singleMessage.title = "Ops!";
						this.singleMessage.content = "Si è verificato un errore mentre gli alimenti venivano spostati nel frigo, per maggiori dettagli visitare la console";
						console.error(error.message)
						activateMessageForm();
				 	}
				 },				
			    allowDrop: function (ev) {
				  ev.preventDefault();
				  var data = ev.dataTransfer.getData('text')
				 	
				},
				drag : function (item) {
				 	this.moving = item;
        	    	console.log(this.moving.name);
				},
				dropOnShelf: function(target, ev){
					try{
						ev.preventDefault();
						if (target.type.toLowerCase() =="fridge" || target.type.toLowerCase() != this.moving.type.toLowerCase() ){
							this.singleMessage.title = "Ehm, non credo sia fattibile";
							this.singleMessage.content = "Non puoi mettere un alimento appartenente al tipo '" + this.moving.type + "' nello saffale '" + target.type.toLowerCase() +"'";
							activateMessageForm();
						}
						else{
							target.groceries.push(this.moving);
							 this.bagList.splice(this.bagList.indexOf(this.moving), 1);
						}					
						if (this.bagList.length == 0 ){
							this.singleMessage.title = "Alla grande!";
							this.singleMessage.content = "Hai avuto la pazienza di fare drag and drop su tutti gli alimenti, ora sono tutti nel frigo, sul proprio scaffale";
							activateMessageForm();
						}
					}catch (error){
						this.singleMessage.title = "Ops!";
						this.singleMessage.content = "Si è verificato un problema durante lo spostamento di un alimento all'interno di uno scaffale, per maggiori dettagli visitare la console";
						console.error(error.message)
						activateMessageForm();
					}
				},
				toggleVisibleCat : function(shelf){
					this.visibleCat = shelf.type.toLowerCase();
				},
				toggleSort : function(){
					if (this.fridgeListSortState == 'asc'){
						this.fridgeListSortState = 'desc';
						this.fridgeActiveOrder = "img/down.svg";
					}
					else{
						this.fridgeListSortState = 'asc';
						this.fridgeActiveOrder = "img/up.svg";
					}
				},
				//creation methods
				getNewId : function(){
					try{
						var newId = -1;
						if (this.bagList.length == 0 ){
							for (var i = 0; i < this.fridge.shelves.length; i++){
								for (var j = 0; j<this.fridge.shelves[i].groceries.length; j++){
									if (newId < this.fridge.shelves[i].groceries[j].id){
										newId = this.fridge.shelves[i].groceries[j].id;
									}
								}
							}
						}
						else{
							newId = max(this.bagList);
						}
						return newId + 1;
					}catch (error){
						this.singleMessage.title = "Ops!";
						this.singleMessage.content = "Si è verificato un problema durante la creazione di un nuovo ID, per maggiori dettagli visitare la console";
						console.error(error.message)
						activateMessageForm();
					}	
				},
				checkAndInsert : function(event){
					try{
						this.formData.errors = [];
						if (!this.formData.name || this.formData.name < 2){
							this.formData.errors.push("Utilizza un nome piu lungo di due caratteri");
						}
						if (!this.formData.type){
							this.formData.errors.push("Assicurati di aver selezionato il tipo");
						}
						if (!this.formData.expiration ){
							this.formData.errors.push("Assicurati di aver selezionato la scadenza");
						}
						if (this.formData.errors.length == 0){
							this.bagList.push({id: this.getNewId(), name: this.formData.name.toLowerCase(), type:this.formData.type, expiration:new Date(this.formData.expiration), img: 'img/' + this.formData.type + '.svg'})
							this.formData.name = "";
							this.formData.type = "";
							this.formData.expiration ="";
							toggleInsertForm();
						}
					}catch (error){
						this.singleMessage.title = "Ops!";
						this.singleMessage.content = "Si è verificato un problema durante l'inserimento di un alimento, per maggiori dettagli visitare la console";
						console.error(error.message)
						activateMessageForm();
					}					
				},
			}
		});
	 	function expiresIn(days) {
		    var date = new Date();
		    date.setDate(date.getDate() + days);
		    return date;
		}
		function max(array){
			var maxId = array[0].id;
			for (i =0; i<array.length; i++){
				if (array[i].id > maxId){
					maxId = array[i].id;
				}
			}
			return maxId;
		}
		function mergeSort (unsortedArray, way) {		
		  if (unsortedArray.length <= 1) {
		    return unsortedArray;
		  }
		  const middle = Math.floor(unsortedArray.length / 2);
		  const left = unsortedArray.slice(0, middle);
		  const right = unsortedArray.slice(middle);
	      return merge( mergeSort(left, way), mergeSort(right, way), way);
		}

		function merge (left, right, way) {
		  let resultArray = [], leftIndex = 0, rightIndex = 0;
		  while (leftIndex < left.length && rightIndex < right.length) {
		  	if (way == 'asc'){
				 if (left[leftIndex].expiration < right[rightIndex].expiration) {
						      resultArray.push(left[leftIndex]);
						      leftIndex++;
				    } else {
						      resultArray.push(right[rightIndex]);
						      rightIndex++;
					}
		  	}
		  	else{
		  			if (left[leftIndex].expiration > right[rightIndex].expiration) {
						      resultArray.push(left[leftIndex]);
						      leftIndex++;
				    } else {	
						      resultArray.push(right[rightIndex]);
						      rightIndex++;
					}
		  	}

		   
		  }
		  return resultArray
		          .concat(left.slice(leftIndex))
		          .concat(right.slice(rightIndex));

		}
		var insertFormTop = "-100vh";
		function toggleInsertForm(){
			if (insertFormTop == "-100vh") {
				document.getElementById("insertForm").style.top= "0";
				insertFormTop	 = '0';
			}
			else{
				document.getElementById("insertForm").style.top = "-100vh";
				insertFormTop = "-100vh";
			}
		}
		function activateMessageForm(){
			document.getElementById("mad-custom-message").style.left= "0";
		}
		function initializeMessageForm(){
				document.getElementById("mad-custom-message").style.left="100vw";
				setTimeout(function(){
					document.getElementById("mad-custom-message").style.display="none";
					setTimeout(function(){
						document.getElementById("mad-custom-message").style.left="-100vw";
						setTimeout(function(){
							document.getElementById("mad-custom-message").style.display="block";
						},300)
					},10)
				},500);
		}