import React from 'react';
import BoardCell from './boardcell/index'

export default class GameBoard extends React.Component{
	state = {
      diamondSelections: [],
      selections: [],
      cellsArray:[]
    }
    componentWillMount(){
    	const {size}=this.props;
    	this.setState({
    		cellsArray:this.handleercellArray(size)
    	})
    }

    handleercellArray=(size)=>{
    	const limit = size*size;
    	const cellsArray=[];
    	for (var i = 0; i < limit; i++) {
    		cellsArray.push(i);
    	}
    	return cellsArray
    }
    handleSelectedCell=(e)=>{

    }

 render(){
 	const {size}=this.props;
  return(
    <div className="gameBoard gameContainer">
    {
    	this.state.cellsArray.map((cell,cellIndex)=>{
    		return <BoardCell key={cell} 
    		id={`cell-${cell}`}
    		size={size}
    		isOpen={false}
    		onSelect={this.handleSelectedCell}

    		/>
    	})
    }
    </div>
  );
 }
}