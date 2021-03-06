import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'

function Home() {
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result); 
            setData(result.posts);   
        })
    },[])

    //Functionality for like
    const likePost = (id) =>{
        fetch('/like', {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    //Functionality for unlike
    const unlikePost = (id) =>{
        fetch('/unlike', {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    //Functionality for comment
    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }
//deleting the post
  const deletePost = (postid)=>{
      console.log(postid);
      
    fetch(`/deletepost/${postid}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
    })
}

    return (
        <div className="home">
            {
                data.map(item => {
                    return(
                        <div className="card home-card" key={item._id}>
                        <h5>{item.postedBy.name} {item.postedBy._id == state._id 
                        && <i className="material-icons" style={{
                            float:"right"
                        }} 
                        onClick={()=>deletePost(item._id)}
                        >delete</i>
                        }</h5>
                        
                        <div className="card-image">
                            <img src={item.photo}/>
                        </div>
                        <div className="card-content">
                        {item.likes.includes(state._id)
                        ?
                        <i className="material-icons"
                        onClick={() => {unlikePost(item._id)}}>thumb_down</i>
                        :
                        <i className="material-icons"
                        onClick={() => {likePost(item._id)}}>thumb_up</i>
                        }
                        <i className="material-icons">favorite</i>
                        {item.likes.length != 0 ? <h6>{item.likes.length} likes</h6>:<p></p>}    
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>

                            {
                                item.comments.map(record=>{
                                    return(
                                    <h6 key={record._id}><span style={{fontWeight:"600"}}>{record.postedBy.name}</span> {record.text}</h6>
                                    )
                                })
                            }

                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value, item._id);
                                
                            }}>
                                <input type="text" placeholder="Add a comment" />
                            </form>    
                        </div>
                    </div> 
                    )
                })
            }    
        </div>
    )
}

export default Home
