import React from 'react';
export default class BoardCell extends React.Component{
 handleClick=(e)=>{
 	let {isOpen,id,isDiamond}=this.props
 	if(!isOpen){
	 	if(isDiamond){
	 		this.props.onDiamondSelect(id)
	 	}
 		this.props.onCellSelect(id)
 	}
 }
 render(){
 	const {isOpen,isDiamond}=this.props;
  return(
   <div className={isOpen?isDiamond?"boradcell bordeCellDiamond":"boradcell bordeCellOpen":"boradcell bordeCellClose	"} role="button" id={this.props.id}
   onClick={this.handleClick}>
   	{this.props.children}
   </div>
  );
 }
}