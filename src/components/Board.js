import React from 'react';
import BoardCell from './boardcell/index'

export default class GameBoard extends React.Component{
	state = {
      diamondSelections: [],
      selections: [],
      cellsArray:[],
      diamondsLocation:[],
      		isGameOver:false,
		inProgress:false
    }
    handleGameOver=(score)=>{
		this.setState({
			isGameOver:true,
			score:score,
		})
	}
	handleNewGame=()=>{
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
    const { size } = this.props;
    this.setState({
      diamondsLocation: this.generateDiamondPositions(size),
      diamondSelections: [],
      selections: [],
      currentCell: null,
    });
  }
	generateDiamondPositions = (row) => {
		const diamonds = [];
		const min = 1;
		const max = row * row;
		while (diamonds.length < row) {
		  const randomNumber = Math.floor(Math.random() * ((max - min) + 1)) + min;
		  if (diamonds.indexOf(randomNumber) === -1) {
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
    		selections:[...this.state.selections,cell]
    	},()=>{
    		this.handleSaveGame(cell)
    	})

    }

 render(){
 	const {size}=this.props;
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

    		/>
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