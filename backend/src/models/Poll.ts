import mongoose, { Schema, type Document} from 'mongoose';

export interface IPoll extends Document{
    question:string;
    options: {id:string,text:string,votes:number}[];
    correctOptionId:string;
    startTime:Date;
    duration:number;
    status : 'ACTIVE' | 'ENDED';
}

const PollSchema : Schema = new Schema({
    question:{type: String, required:true},
    options: [{id:{type:String,required:true},text:{type:String,required:true},votes: { type: Number, default: 0 }, }],
    correctOptionId:{type:String, required:true},
    startTime:{type:Date,default:Date.now()},
    duration:{type:Number, required:true},
    status : {type:String, enum:['ACTIVE' , 'ENDED'], default:'ACTIVE'}
});

export const Poll = mongoose.model<IPoll>('Poll', PollSchema);