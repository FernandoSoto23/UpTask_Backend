import mongoose, {Schema,Document, Types} from "mongoose";
export interface IToken extends Document{
    token: string,
    user: Types.ObjectId,
    createdAt: Date
}

const tokenSchema : Schema= new Schema({
    token : {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: "User"
    },
    expiresdAt : {
        type: Date,
        default: Date.now(),
        expires: "180d"
    },
})

const Token = mongoose.model<IToken>("Token",tokenSchema);
export default Token;