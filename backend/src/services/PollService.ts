import { Poll } from "../models/Poll.js";
import {v4 as uuidv4} from "uuid";
import { Vote } from "../models/Vote.js";
import { type IPoll } from "../models/Poll.js";

export class PollService{
   async createPoll (data:{question:string,options:string[], correctOption:string, duration:number}){
        const existingActivePoll = await Poll.findOne({status:'ACTIVE'});

        if(existingActivePoll){
            throw new Error("A Poll is already in progress.");
        }

        const formattedOptions = data.options.map(option=>({
            id:uuidv4(),
            text:option,
            votes:0
        }))

        const answer = formattedOptions.find(opt=> opt.text === data.correctOption);

        if(!answer){
            throw new Error("Answer doesnt match with any of the given options");
        }

        const newPoll:IPoll = await Poll.create({
            question:data.question,
            options: formattedOptions,
            correctOptionId:answer.id,
            duration:data.duration,
            startTime: new Date(),
            status:'ACTIVE',
        });

        return newPoll;
    }

    async getActivePoll(){
        const poll = await Poll.findOne({status:'ACTIVE'}).lean() as IPoll|null;
        if(!poll) return null;

        const now = Date.now();
        const start = poll.startTime.getTime();
        const elapsedSeconds = Math.floor((now-start)/1000);
        const remainingTime = poll.duration-elapsedSeconds;

        if(remainingTime<=0){
            Poll.updateOne({_id:poll._id},{status:'ENDED'});
            return{...poll, status:'ENDED', remainingTime:0};
        }
        const{correctOptionId, ...securePollData} = poll;

        return{poll:securePollData,remainingTime};
    }

    async submitVote(pollId:string,sessiondId:string,optionId:string){
        this.getActivePoll();

        const existingVote = await Vote.findOne({
            pollId : pollId,
            studentId:sessiondId,
        })

        if(existingVote){
            throw new Error("You have already voted in this poll!");
        }

        const newVote = await Vote.create({
            pollId : pollId,
            studentId:sessiondId,
            optionId : optionId,
        })

        await Poll.updateOne(
            {_id:pollId, "options.id":optionId},
            {$inc:{"options.$.votes":1}}
        )

        return newVote;
        
    }


}


export const pollService = new PollService();