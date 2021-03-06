// user.model

import bcrypt from 'bcrypt';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    fullname: string;
    username: string;
    password: string;
    email: string;
    active: boolean;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}

export enum UserRoles {
    user = 0,
    admin = 1,
}

const UserSchema: Schema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        require: true,
        default: true,
    },
    role: {
        type: Number,
        enum: UserRoles,
        default: UserRoles.user,
        required: true,
    }
});

UserSchema.pre('save', async function () {

    const user = this as IUser;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        ;
        return;
    }

    const saltRound = parseInt(process.env.AUTH_SALT_ROUND);
    // generate a salt
    const salt = await bcrypt.genSalt(saltRound);
    // hash the password using our new salt
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model<IUser>('User', UserSchema);