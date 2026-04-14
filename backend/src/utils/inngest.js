import { Inngest } from "inngest";
import { User } from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Vault-Break" });

//to save user to database
const syncUserCreation = inngest.createFunction(
      {id: 'sync-user-from-clerk'},
      {event: 'clerk/user.created'},
      async ({ event }) =>{
         const {id, first_name, last_name, email_addresses,pass_word} = event.data;
         const userData ={
            _id: id,
            email: email_addresses[0].email_address,
            fullname: `${first_name} ${last_name}`,
            username: email.split('@')[0],
            password: pass_word
        }
         await User.create(userData)
      }
)

//to delete user from database
const syncUserDeletion = inngest.createFunction(
      {id: 'delete-user-with-clerk'},
      {event: 'clerk/user.deleted'},
      async ({ event }) =>{
         const {id} = event.data;
         await User.findByIdAndDelete(id);
      }
)

//to update user in database
const syncUserUpdate = inngest.createFunction(
      {id: 'update-user-from  -clerk'},
    {event: 'clerk/user.updated'},
      async ({ event }) =>{
         const {id, first_name, last_name, email_addresses,pass_word} = event.data;
         const userData ={
            _id: id,
            email: email_addresses[0].email_address,
            fullname: `${first_name} ${last_name}`,
            username: email.split('@')[0],
            password: pass_word
        }
         await User.findByIdAndUpdate(id, userData);
      }
)


// export Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];