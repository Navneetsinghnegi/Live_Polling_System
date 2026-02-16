import { Poll } from "../models/Poll.js";
import {v4 as uuidv4} from "uuid";
import { Vote } from "../models/Vote.js";
import { type IPoll } from "../models/Poll.js";
import mongoose,{ set } from "mongoose";

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

        setTimeout(async()=>{
            await Poll.updateOne({_id:newPoll._id, status:'ACTIVE'}, {status:'ENDED'})

            const{io} = await import('../index.js');
            io.emit('pollEnded', {pollId:newPoll._id});

            console.log(`Poll ${newPoll._id} auto-closed`);
        }, data.duration *1000);

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
            await Poll.updateOne({_id:poll._id},{status:'ENDED'});
            return{...poll, status:'ENDED', remainingTime:0};
        }
        const{correctOptionId, ...securePollData} = poll;

        return{poll:securePollData,remainingTime};
    }

    async submitVote(pollId:string,sessiondId:string,optionId:string){
        const activePoll = await this.getActivePoll();

        if(!activePoll || (typeof activePoll === 'object' && 'status' in activePoll && activePoll.status ==='ENDED')){
            throw new Error("This poll has already ended");
        }

        const pollObjectId = new mongoose.Types.ObjectId(pollId);

        const existingVote = await Vote.findOne({
            pollId : pollObjectId,
            studentId:sessiondId,
        })

        if(existingVote){
            throw new Error("You have already voted in this poll!");
        }

        await Vote.create({
            pollId : pollObjectId,
            studentId:sessiondId,
            optionId : optionId,
        })

        const updatedPoll = await Poll.findOneAndUpdate(
            {_id:pollObjectId, "options.id":optionId},
            {$inc:{"options.$.votes":1}},
            {new : true}
        )

        if(!updatedPoll){
            throw new Error("Poll or option not found");
        }

        return updatedPoll;
        
    }

    async getPollResults(pollId:string){
        const poll = await Poll.findById(pollId).lean() as IPoll | null;
        if(!poll) throw new Error ("Poll not found");

        const totalVotes = poll.options.reduce((sum,opt) => sum+opt.votes,0);
        let winner = "Poll still in progress";
        if (poll.status === 'ENDED') {
            const topOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
            winner = topOption && topOption.votes > 0 ? topOption.text : "No votes cast";
        }

        const correctOption = poll.options.find(opt => opt.id === poll.correctOptionId);
        const correctVotes = correctOption ? correctOption.votes : 0;
        const accuracyRate = totalVotes > 0 ? (correctVotes / totalVotes) * 100 : 0;

        return {
            question: poll.question,
            totalVotes,
            accuracyRate: accuracyRate.toFixed(2) + "%",
            winner,
            options: poll.options, // Detailed breakdown
            correctOptionId: poll.correctOptionId
        };

    }


}


export const pollService = new PollService();