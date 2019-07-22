import React from 'react';
import Board from './Board';
export default class GameMenu extends React.Component{
	state={
		isGameOver:false,
		inProgress:false
	}
	componentDidMount(){

	}
	
	render(){
				console.log("SDDSDSSDDSDS render",this.state.inProgress)
		return(
			<div className="container">
				<Board size={8} numberOfDiamonds={6} handleGameOver={this.handleGameOver}/>
			</div>
		);
	}
}