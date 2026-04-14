import { Inngest } from "inngest";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "VaultBreak" });

// Save user to DB when created in Clerk
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, username, image_url } = event.data;
    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      fullname: `${first_name} ${last_name}`,
      username: username || email_addresses[0].email_address.split("@")[0],
      avatar: image_url || "",
    });
  }
);

// Delete user from DB when deleted in Clerk
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Update user in DB when updated in Clerk
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, username, image_url } = event.data;
    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      fullname: `${first_name} ${last_name}`,
      username: username || email_addresses[0].email_address.split("@")[0],
      avatar: image_url || "",
    });
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];