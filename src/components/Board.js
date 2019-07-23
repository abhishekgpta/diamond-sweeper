import React from 'react';
import BoardCell from './boardcell/index'

export default class GameBoard extends React.Component{
	state = {
      diamondSelections: [],
      selections: [],
      cellsArray:[],
      diamondsLocation:[],
      isGameOver:false,
		inProgress:false,
		currentCell:""
    }
    handleGameOver=(score)=>{
		this.setState({
			isGameOver:true,
			score:score,
		})
	}
	handleNewGame=()=>{
		this.restartGame()
		this.setState({
			isGameOver:false,
			inProgress:false
		})
	}
	handleResumeGame=()=>{
		this.resumeGame();
		this.setState({
			inProgress:false
		})
	}
    componentWillMount(){
    	const {size,numberOfDiamonds}=this.props;
    	this.setState({
    		cellsArray:this.handleercellArray(size),
    		diamondsLocation:this.generateDiamondPositions(numberOfDiamonds),
			inProgress:true
    	});
    	
    }
    restartGame = () => {
    const { size,numberOfDiamonds } = this.props;
    this.setState({
      diamondsLocation: this.generateDiamondPositions(numberOfDiamonds),
      diamondSelections: [],
      selections: [],
      currentCell: "",
    });
  }
	generateDiamondPositions = (row) => {
		const diamonds = [];
		const min = 1;
		const max = row * row;
		while (diamonds.length < row) {
		  const randomNumber = Math.floor(Math.random() * ((max - min) + 1)) + min;
		  if (diamonds.indexOf(`cell-${randomNumber}`) === -1) {
		    diamonds.push(`cell-${randomNumber}`);
		  }
		}
		return diamonds;
	}
	handleSaveGame=(cell)=>{
		localStorage.setItem('gameprogress', btoa(
      JSON.stringify({
        selections: this.state.selections,
        diamondsLocation: this.state.diamondsLocation,
        diamondSelections: this.state.diamondSelections,
        currentCell: cell,
      }),
    ));
	}
	resumeGame = () => {
    const progress = JSON.parse(atob(localStorage.gameprogress));
    this.setState(progress);
  	}
    handleercellArray=(size)=>{
    	const limit = size*size;
    	const cellsArray=[];
    	for (var i = 0; i < limit; i++) {
    		cellsArray.push(i);
    	}
    	return cellsArray
    }
	handleDiamondSelect=(cell)=>{
		this.setState({
		  diamondSelections: [...this.state.diamondSelections, cell],
		}, () => {
	      if (this.state.diamondSelections.length === this.props.numberOfDiamonds) {
	        this.handleGameOver(this.state.cellsArray.length - this.state.selections.length);
	      }
    });
	}

    handleSelectedCell=(cell)=>{
    	this.setState({
    		selections:[...this.state.selections,cell],
    		currentCell:cell
    	},()=>{
    		this.handleSaveGame(cell)
    	})

    }
    getRowAndColumnNumber=(cellPos,size)=>{
    	const rowNumber = Math.floor(cellPos/size);
    	const colNumber= cellPos%size;
    	return[colNumber,rowNumber];
    }
    getDiamondLocation=()=>{
    	let {currentCell, diamondsLocation }=this.state;
    	let {size} = this.props;
    	let cellNumber = parseInt(currentCell.split("-")[1])
    	let coordinates = this.getRowAndColumnNumber(cellNumber,size)
    	
    	let arrowAngle=0;
    	let arrowDistance=0;
    	let hiddenDiamonds = diamondsLocation.filter((diamond)=>(this.state.diamondSelections.indexOf(diamond)===-1));
    	let hiddenDiamondsCoordinates = hiddenDiamonds.map((diamond)=>{
    		let diamondNumber =parseInt(diamond.split("-")[1]);
    		let diamondCoordinates = this.getRowAndColumnNumber(diamondNumber,size);
    		if(diamondCoordinates[0] === coordinates[0]){
    			if(diamondCoordinates[1] > coordinates[1]){
    				// arrowAngle=270;
    				arrowAngle=90;
    			}
    			else{
    				// arrowAngle=90;
    				arrowAngle=270;
    			}
    			arrowDistance = Math.abs(diamondCoordinates[1] - coordinates[1]);
    		}
    		else if(diamondCoordinates[1] === coordinates[1]){
    			if(diamondCoordinates[0] > coordinates[0]){
    				// arrowAngle=180;
    				arrowAngle=0;
    			}
    			else{
    				arrowAngle=180;
    				// arrowAngle=0;
    			}
    			arrowDistance = Math.abs(diamondCoordinates[0] - coordinates[0]);
    		}
    		else{
    			if (diamondCoordinates[1] < coordinates[1] && diamondCoordinates[0] < coordinates[0]) {
		          // arrowAngle = 45;
		          arrowAngle = 225;
		        } else if (diamondCoordinates[1] < coordinates[1] && diamondCoordinates[0] > coordinates[0]) {
		          // arrowAngle = 135;
		          arrowAngle = 315;
		        } else if (diamondCoordinates[1] > coordinates[1] && diamondCoordinates[0] > coordinates[0]) {
		          // arrowAngle = 225;
		          arrowAngle = 45;
		        } else if (diamondCoordinates[1] > coordinates[1] && diamondCoordinates[0] < coordinates[0]) {
		          // arrowAngle = 315;
		          arrowAngle = 135;
		        }
		        const a = diamondCoordinates[0] - coordinates[1];
		        const b = diamondCoordinates[1] - coordinates[1];
		        arrowDistance = Math.sqrt((a ** 2) + (b ** 2));
    		}
    		return{
    			angle:arrowAngle,
    			distance:arrowDistance
    		}
    	});
		 return hiddenDiamondsCoordinates.length>0? hiddenDiamondsCoordinates.reduce((prev, curr) => (
		      prev.distance < curr.distance ? prev : curr
		    )):{};
    }

 render(){
 	const {size}=this.props;
 	let nearestDiamond = this.getDiamondLocation();
  return(
  	<div>
    <div className="gameBoard gameContainer">
    {
    	this.state.cellsArray.map((cell,cellIndex)=>{
    		return <BoardCell key={cell} 
    		id={`cell-${cell}`}
    		size={size}
    		isOpen={this.state.selections.indexOf(`cell-${cell}`)>-1}
    		isDiamond={this.state.diamondsLocation.indexOf(`cell-${cell}`)>-1}
    		onCellSelect={this.handleSelectedCell}
    		onDiamondSelect={this.handleDiamondSelect}

    		>
    		{
    			this.state.currentCell===`cell-${cell}`&& this.state.diamondSelections.indexOf(`cell-${cell}`)===-1 &&
    			<div className="bordeCellArrow" style={{transform:`rotate(${nearestDiamond.angle}deg)`}}>
    				
    			</div>

    		}
    		</BoardCell>
    	})
    }

    </div>
        {
		this.state.isGameOver && <div className="gameResult">
		<h3>{`Your Score: ${this.state.score}`}</h3>
		<button onClick={this.handleNewGame}>New Game</button>
		</div>
	}
	{
		this.state.inProgress && <div className="gameResume">
			<h3>Resume Game</h3>
			<button onClick={this.handleResumeGame}>Resume Game</button>
			<button onClick={this.handleNewGame}>New Game</button>
		</div>
	}
    </div>
  );
 }
}