import React,{useEffect,useState} from 'react'
import {io} from 'socket.io-client'
import { Col, Container,Row,Badge,Card,Button,Alert} from 'react-bootstrap'
import { FaBell } from "react-icons/fa";
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Socket from './socket';
export default function Queuedisplay(props) {
    const { auth } = useAuth();
    const { setAuth } = useAuth();
    const [current,setCurrent]=useState('')
    const [next,setNext]=useState('')
    const [counter,setCounter]=useState('')
    const [queue_num,setQueuenum]=useState('')
    const [user,setUser]=useState('')

  

    useEffect(() =>{
      setUser(auth?.user)
     
     if(auth?.counter==undefined ||auth?.queue_num==undefined)
     {
      setCounter(props.counter)
      setQueuenum(props.queuenum)
     }
     else{
      setCounter(auth?.counter)
      setQueuenum(auth?.queue_num)
     }
      
      
      console.log(auth?.queue_num)
      console.log(auth?.counter)

        
       
        const id=props.counter||auth?.counter
        console.log(id)

        if(id==2){

          Socket.on('getqueuenum1',(m)=>{
             setNext(m.counter_next_num)
             setCurrent(m.counter_current_num)
           })
           
            


        }
      if(id==3){

          Socket.on('getqueuenum2',(m)=>{
            // console.log(m.counter_current_num)
             //console.log(m.counter_next_num)
             setNext(m.counter_next_num)
             setCurrent(m.counter_current_num)
           })
           

        }
       if(id==4){

          Socket.on('getqueuenum3',(m)=>{
            // console.log(m.counter_current_num)
             //console.log(m.counter_next_num)
             setNext(m.counter_next_num)
             setCurrent(m.counter_current_num)
           })
           

        }
       
         
      },[])

      const logout = async () => {
        try {

          localStorage.clear();
          setAuth();
        } 
       catch (error) {
              console.log(error);         
       }
      }



  return (
    <div>
        <Container>
<Row>
  <Col></Col>
<Col>
  
    <Card.Body id="profilename"  border="primary" style={{ width: '13rem' }}>
    <Badge pill bg="primary"><h6>{user}</h6></Badge>
    <Button id='logoutbtn' variant="outline-danger"
      onClick={() => logout()}
    >Logout</Button>
    </Card.Body>
    <Link to="/notifications">
    <Button id='submitbtn' variant="primary" type="submit">
      
  <FaBell /> 
  </Button></Link>
       </Col> </Row>
            <Row>
                <Col md={{ span: 4, offset: 4 }}>
                <Card id="id"  md={{ span: 6, offset: 3 }} border="primary" style={{ width: '26rem', height: '26rem' }}>
    
    <Card.Title >
    <div class=" d-flex align-items-center justify-content-center">
        <Badge pill bg="info" >
        <h4>counter 00{counter}</h4>
        </Badge>
        </div>
    </Card.Title>
  <Card.Body>
  <div class=" d-flex align-items-center justify-content-center">
        <div id='yourtext'>Your Number</div>
        <div id='yournum'>0{queue_num}</div></div>
        <div class=" d-flex align-items-center justify-content-center">
        <div id='currenttxt'>Current Number</div>
        </div>
        <div class=" d-flex align-items-center justify-content-center">
         <h1 id='currentnum'>0{current}</h1>
         </div>
         <div class=" d-flex align-items-center justify-content-center">
         <h1 id='nexttxt'>Next Number</h1>
         <h1 id='nextnum'>0{next}</h1>
         </div>

     
    
   
   
    
  </Card.Body>
     </Card>
                </Col>
            </Row>
        </Container>
       
    </div>
  )
}
