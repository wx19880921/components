import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
//var $ = require('jquery');

$("#hello").html("hello22");

$(function(){
	$("#hello").html("hello");
        
		//$('#dLabel').dropdown();
		$('#dLabel').on('show.bs.dropdown', function () {
		    console.log("dropdown start");
		})
		
		
		$('#myModal').on('hidden.bs.modal', function (e) {
		  alert("hello");
		})	
		
		$("#btn").on("click",function(){
			
			$('#myModal').modal();
			
		});
	 
});

class Animal {
    constructor(){
        this.type = 'animal'
    }
    says(say){
        console.log(this.type + ' says ' + say)
    }
}

let animal = new Animal()
animal.says('hello') //animal says hello

class Cat extends Animal {
	constructor(){
        super();
        this.type = 'cat'
    }
}

let cat = new Cat()
let ii=(i)=>{return i+13+6};
cat.says('hello:'+ ii(3)) //cat says hello


function animals(...types){
    console.log(types)
}
animals('cat', 'dog', 'fish')



let cat1 = 'ken';
let dog = 'lili';
let zoo = {cat1, dog};
console.log(zoo) 



function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);