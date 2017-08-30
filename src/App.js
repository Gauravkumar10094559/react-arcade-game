let React=require('react');
let $=require('jquery');
let gameData=require('./gameData');
require('./App.css');



class PlayerInput extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			health:100,
			level:1,
			dungeon:1
		}

	}

	onnextMove(id,x,y) {

	this.portal=true;
	let currentCell=document.getElementById(id);
	id=x+'-'+y;
	let newCell=document.getElementById(id);

		if(newCell.style.background!=='black'){
			
			if(newCell.style.background==='green') {
				this.setState(()=> {
					return {
					health:this.state.health+10
					}
				})
			}
			if(newCell.style.background==='crimson') {
				this.setState(()=> {
					return {
					health:this.state.health-30
					}
				})
			}
			if(newCell.style.background==='orange') {
				this.setState(()=> {
					return {
					level:this.state.level+1
					}
				})
			}
			if(newCell.style.background==='violet') {
 
				newCell.style.background='skyblue';
				newCell.classList.remove('player');
				currentCell.classList.remove('player');
				currentCell.style.background='skyblue';
 
				this.portal=false;
				this.setState(()=> {
					return {
					dungeon:this.state.dungeon+1
					}
				})
				this.props.onPortalChange(
					this.state.dungeon
				)
			}
			if(this.portal) {
				
				newCell.style.background='blue';
				newCell.classList.add('player');
				currentCell.classList.remove('player');
				currentCell.style.background='skyblue';	
			}

		}
}

	move(code) {

	let id=$('.player').attr('id');
	let x=Number(id.split('-')[0]); let y=Number(id.split('-')[1]);

		if(code===37) {

			y-=1;

		} else if(code===38) {
			
			x-=1;

		} else if(code===39) {

			y+=1;

		} else if(code===40) {

			x+=1;

		}

		this.onnextMove(id,x,y);

	}

	componentDidMount() {
		$('body').keydown((event)=> {
			if(event.keyCode===37 || event.keyCode===38 || event.keyCode===39 || event.keyCode===40) {
				this.move(event.keyCode);
			}
			else{
				alert('press up , down , left or right key');
			}
		})
	}

	render() {
		if(this.state.health<=0) {
			alert('u lost');
			window.location.reload();
		}
		return (
			<div>
				<ul>
					<li>Player's Health:{this.state.health}</li>
					<li>Weapon Level:{this.state.level}</li>
					<li>Dungeon:{this.state.dungeon}</li>
				</ul> 
			</div>

		)
	}
}

class Playfield extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			level:1
		}
		this.handleChange=this.handleChange.bind(this);
	}

	handleChange(l) {
		console.log(l);
		this.setState(function() {
			return {
				level:l
			}
		})
		this.setField();
	}

	randomCoordX() {
		return Math.floor((Math.random()*50)+1);
	}

	randomCoordY() {
		return Math.floor((Math.random()*100)+1);
	}

	safeLanding(color) {
		let x=this.randomCoordX();
		let y=this.randomCoordY();
		let id=x+'-'+y;
		let fieldColor=document.getElementById(id).style.background;
		if(fieldColor==='skyblue') {
			document.getElementById(id).style.background=color;
			if(color==='blue') {
				let player=document.getElementById(id);
				player.classList.add('player');
			}
		}else{
			this.safeLanding(color);
		}
	}

	placeSub(subjects) {
		let number=subjects.quantity;
		while(number>=1) {
			this.safeLanding(subjects.color);
			number--;
		}

	}

	makefield(field) {
		 
		let id;
		if(field.type==='rect') {
			for(let i=field.position.x;i<=field.position.x+field.width;i++) {
				for(let j=field.position.y;j<field.position.y+field.height;j++) {
					id=i+'-'+j;
					document.getElementById(id).style.background='skyblue';
				}
			}
		}
		else{
			if(field.orientation==='horizontal') {
				for(let k=field.position.y;k<=field.position.y+field.length;k++)
				{
					id=field.position.x+'-'+k;
					document.getElementById(id).style.background='skyblue';
				}

			}else {
				for(let l=field.position.x;l<=field.position.x+field.length;l++)
				{
					id=l+'-'+field.position.y;
					document.getElementById(id).style.background='skyblue';
				}
			}
		}
	}

	setField() {

		$('.cell').each(function() {
			$(this).css('background','black');
		})
		if(this.state.level<=4) {
		    let data=gameData.fetchgameData(this.state.level);

		    data[0].map((value)=> {
		    	return this.makefield(value);
		    });

		    data[1].map((value)=>{
		    	return this.placeSub(value);
		    })	
		} else {
			alert('the game is over');
			window.location.reload();
		}

	    $('.cell').on('click',function() {
	    	console.log(this);
	    })
	}

	componentDidMount() {

	    for(let i=1;i<51;i++)
	    { 
	      for(let j=1;j<101;j++)
	      {
	        $('#container').append('<div class="cell" style="background:black"  id="'+i+"-"+j+'"></div>');
	      }
	    }	

	    this.setField();

	}

	render() {
		return (
			<div>
				<div id="container"></div>
				<PlayerInput onPortalChange={this.handleChange}/>
			</div>

		)
	}
}


class App extends React.Component {
	render() {
		return (
			<div>
				<h1>This is an Arcade Game</h1>
				<Playfield/>
			</div>
		)
	}
}

module.exports=App;