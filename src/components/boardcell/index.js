import React from 'react';
export default class BoardCell extends React.Component{
 render(){
  return(
   <div className="boradcell" id={this.props.id}></div>
  );
 }
}