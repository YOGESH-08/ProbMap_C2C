import mongoose,{Schema, type InferSchemaType} from "mongoose";

const userSchema = new Schema(
    {
        fullName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        phone:{
            type:String,
            required:true,
            unique:true,
        },
        gender:{
            type:String,
            enum:["male", "female", "other"],
        },
        isAdmin:{
            type:Boolean,
            default:false,
        },
         isAvailable: {
      type: Boolean,
      default: false,
    },
    isAgent: {
      type: Boolean,
      default: false,
    },
    loginMethod:{
        type:String,
        enum:["google", "email"],
        default:"email",
    },
    firebaseUID:{
        type:String,
        required:true,
        unique:true,
    },
    addresses:[{
        type:Schema.Types.ObjectId,
        ref:"Address",
    },
],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
    warnings:{
        type:Number,
        default:0,
    },
    isBanned:{
        type:Boolean,
        default:false,
    },
    banExpiryDate:{
        date:Date,
        default:null,
    }
    },
    {timestamps:true},
);

type UserType = InferSchemaType<typeof userSchema>;

export const User = mongoose.model<UserType>("user",userSchema);