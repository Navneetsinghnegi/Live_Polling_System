import {type Request,type Response} from 'express';
import { pollService } from '../services/PollService.js';
import { io } from '../index.js';

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

            io.emit('pollStarted',{
                id:newPoll._id,
                question:newPoll.question,
                options: newPoll.options.map(o => ({ id: o.id, text: o.text })),
                duration: newPoll.duration
            })

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

            const updatedPoll = await pollService.submitVote(pollId,sessionId,optionId);

            if(updatedPoll){
                io.emit('voteUpdate',{
                    pollId: updatedPoll.id,
                    options:updatedPoll.options
                })
            }

            return res.status(200).json({
                success: true,
                message: "Vote recorded! 🗳️",
                
            });
        }catch(error:any){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
    }
    getResults = async (req: Request, res: Response) => {
        try {
            const pollId = req.params.pollId as string;
            
            if (!pollId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing required field: pollId" 
                });
            }
            
            const results = await pollService.getPollResults(pollId);
            return res.status(200).json({ success: true, data: results });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    };


}

export const pollController = new PollController();