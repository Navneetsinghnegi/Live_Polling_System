import {type Request,type Response} from 'express';
import { pollService } from '../services/PollService.js';

class  PollController{
    createPoll = async (req:Request,res:Response)=>{
        try{
            const{question,options,correctOption,duration} = req.body;

            const newPoll = await pollService.createPoll({
                question,
                options,
                duration,
                correctOption
            });

            return res.status(201).json({
                succes:true,
                data:newPoll
            })
        }catch(error:any){
            return res.status(400).json({succes:false, message:error.message});
        }
    };

    getActivePoll=async (req:Request,res:Response)=>{
        try{
            const activePollData = await pollService.getActivePoll();

            if(!activePollData){
                return res.status(200).json({
                    succes:true,
                    message:"No active poll at the moment",
                    data:null
                });
            }

            return res.status(200).json({
                success:true,
                data:activePollData
            })
        }catch(error:any){
            res.status(400).json({
                success:false,
                message:error.message
            })
        }
        
    };

    submitVote = async (req:Request, res:Response)=>{
        try{
            const {pollId,optionId,sessionId} = req.body;

            if (!pollId || !optionId || !sessionId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing required fields: pollId, optionId, or sessionId" 
                });
            }

            const vote = await pollService.submitVote(pollId,sessionId,optionId);

            return res.status(200).json({
                success: true,
                message: "Vote recorded! 🗳️",
                data: vote
            });
        }catch(error:any){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
    }
}

export const pollController = new PollController();