import mongoose, {Schema,Document} from "mongoose";

export interface IVote extends Document{
    pollId:mongoose.Types.ObjectId;
    studentId:string;
    optionId:string;
}

const VoteSchema :Schema = new Schema({
    pollId:{type:mongoose.Types.ObjectId,ref:'Poll',required:true},
    studentId:{type:String, required:true},
    optionId:{type:String, required:true}
})

VoteSchema.index({pollId:1,studentId:1}, {unique:true});

export const Vote = mongoose.model<IVote>('Vote',VoteSchema);