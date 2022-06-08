import { Request,Response } from "express";
import { Nuser } from "../entities/Nuser";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { AppDataSource } from "../index"
import { Issue } from "../entities/Issue";

export const createNuser =async (req:Request,res:Response) =>{
    
   try {

    const{username,password} =req.body

    const cuser = new Nuser();
    cuser.username =username
    cuser.password =password
 

    cuser.password=await cuser.encryptPassword(cuser.password);
    const saveduser=await cuser.save()
 
   //token
   const token= jwt.sign({id :saveduser.id }, process.env.TOKEN_SECRECT|| 'tokentest');
   
   res.header('auth-token',token).json(saveduser);
    


   } catch (error) {

      res.status(500).json({message:error.message})
   }
    
}

export const getNusers =async (req:Request,res:Response) =>{
    
    try {
   const nusers = await Nuser.find()
     res.json(nusers)
     //console.log(req.body.userId);
    } catch (error) {
 
      //  res.status(500).json({message:error.message})
    }
     
 }

 export const getNuser =async (req:Request,res:Response) =>{
    
    try {
     const {id}= req.params
    // console.log(req.body.userId);
     const cuser = await Nuser.findOneBy({id: parseInt(id)})
      res.json(cuser)
 
     } catch (error) {
 
     //   res.status(500).json({message:error.message})
     }
     
 }

 
 export const havingissue =async (req:Request,res:Response) =>{
    
   try {
    const {id}= req.body.userId
    console.log(req.body.userId);
    const havingissue = await AppDataSource.getRepository(Nuser) 
     
    .createQueryBuilder("nuser")
    .where("nuser.id = :id", { id: req.body.userId })
    .getRawOne();
    res.json(havingissue.nuser_havingissue)
     

    } catch (error) {

       res.status(500).json({message:error.message})
    }
    
}
 
/*  export const updateNusers =async (req:Request,res:Response) =>{
     try {

        const {id}= req.params;

        const user = await Nuser.findOneBy({id: parseInt(req.params.id)})

        if(!user)  return res.status(404).json({ message: "user does not exists"});

        await Cuser.update({id: parseInt(id)}, req.body)
        return  res.json({message:"successfully updated"});
     
  
    } catch (error) {
 
      return  res.status(500).json({
         //message:error.message
      })
    }
     
 }
 
 export const deleteNusers =async (req:Request,res:Response) =>{
   
    try {

       const {id}= req.params;

       const result = await Cuser.delete({id: parseInt(id)})

       if(result.affected ===0){
        return res.status(404).json({ message: "user does not exists"});
       } 

   
       return  res.json({message:"successfully deleted"});
    
 
   } catch (error) {

    return  res.status(500).json({
       //message:error.message
      })
   }
    
} */

//login nuser
export const loginNuser =async (req:Request,res:Response) =>{
   
   try {
      const{username,password} =req.body
      const nuser = await Nuser.findOneBy({username:username});
      if(!nuser) return res.status(400).json('username or password is wrong')

      const correctPassword: boolean =await nuser.validatePassword(password)
      if(!correctPassword) return res.status(400).json('invalid password');

       //token
       const token= jwt.sign({id :nuser.id }, process.env.TOKEN_SECRECT|| 'tokentest');
       // res.header('accessToken',token).json(nuser);
     
      


      
         const issue = await AppDataSource.getRepository(Issue) 
     
         .createQueryBuilder("issue")
         .where("issue.nuser = :nuser", { nuser: nuser.id })
         .andWhere("issue.isDone = :isDone", { isDone: false })
         .getRawOne();

         console.log(issue)
         if(issue){
            const counter=issue.issue_counterId
            const queue_num=issue.issue_counterid
            
            console.log(queue_num)
            return res.json({'accessToken':token,'counter':issue.issue_counterId,'queue_num':issue.issue_queue_num});
         }

       return res.json({'accessToken':token});
   

  } catch (error) {

    return  res.status(500).json({
       message:error.message
      })
  }
   
}