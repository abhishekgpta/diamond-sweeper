import React from 'react';
import Board from './Board';
export default class GameMenu extends React.Component{
 render(){
  return(
   <div className="container">
    <Board size={8}/>
   </div>
  );
 }
}