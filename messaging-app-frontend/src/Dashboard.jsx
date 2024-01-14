import React from "react";
import { useStateValue } from "./components/StateProvider";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Avatar, Typography } from "@material-ui/core";
import { auth } from "./firebase";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import axios from "./components/axios";
import { useEffect, useState } from "react";



const useStyles = makeStyles((theme) => ({
root:{
    display:"flex",
    justifyContent:"center",
    alignItems:"flex-start",
    minHeight:"100%",
    minWidth:"100%",
    
},
  card: {
    maxWidth: 400,
    borderRadius: 16,
    position:"absolute",
    top:"50%",
    left:"50%",
    transform:"translate(-50%,-50%)",
    textAlign: "center",
    padding: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: "0 auto",
  },
}));

const SignOutButton = () => {
    const [{ }, dispatch] = useStateValue();


    const handleSignOut = () => {
        auth.signOut();
        dispatch({
            type: 'SET_USER',
            user: null
        });
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <Button className="topbtn" variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
        </Button>
    );
};

const MessagerieButton = () => (
    <Button variant="contained" color="primary" className="messagerie">
        <Link href="/messagerie" style={{ color: 'white', textDecoration: 'none' }}>
            Messagerie
        </Link>
    </Button>
);





const Dashboard = () => {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [viewmesMessages, setViewmesMessages] = useState(false);
  const username = user?.displayName;
 const [messages, setMessages] = useState([]);
  const getMymessages=()=>{
    axios.get(`/messages/sync/${username}`).then(res => {
        console.log(res.data);
        setMessages(res.data);
      }
    )
    }
    const MesMessagesButton = () => (
      <Button variant="contained" color="primary" className="mesMessages" onClick={()=>setViewmesMessages(true)}>
    
          Mes Messages
      </Button>
    );
    useEffect(() => {
        getMymessages();
        }, []);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Avatar className={classes.avatar} alt={user?.displayName} src={user?.photoURL} />
          <Typography variant="h5" gutterBottom>
           Bienvenue dans le dashboard, {user?.displayName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Email: {user?.email}
          </Typography>
          
        </CardContent>
      </Card>
        <SignOutButton />
        <MessagerieButton />
        <MesMessagesButton />
 
         {viewmesMessages ? <>       
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            textAlign: "center",
        
            width: "100%",
            height: "100%",
            overflow: "auto",
            background: "black",
  
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
            zIndex: "1",
            opacity: "0.9"
        
        }}>  </div> <h4>mes Messages</h4>
           <div className="" style={{
             position:"absolute",
              top:"50%",
              left:"50%",
              zIndex:"1",
              transform:"translate(-50%,-50%)",
           }}>{messages.map(message => (
                <p className={`chat__message ${message.name === user.displayName && 'chat__receiver'}`}>
                    <span className="chat__name">{message.name}</span>
                        {message.message}
                    <span className="chat__timestamp">
                        {message.timestamp}
                    </span>
                </p>
            ))
            }</div> <div style={{
              fontSize:"20px",
              position:"absolute",
              bottom:"100px",
              left:"50%",
              zIndex:"1",
              transform:"translateX(-50%)",
              cursor:"pointer",
              color:"white",
              fontWeight:"bold"

            }} onClick={()=>setViewmesMessages(false)}>Fermer</div> </> : <></>}
       
      
    </div>
  );
};

export default Dashboard;
