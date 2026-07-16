import { Response } from "express";
import { AuthRequest } from "../types/request.type";
import { accountInterfaceInput } from "../types/accounts.type";
import { AccountService } from "../services/acccount.service";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";


dotenv.config();

const secret = process.env.JWT_SECRET || "defaultsecret";

export class AccountController {

  static register = async (request : AuthRequest , response : Response) => {
    const accountData : accountInterfaceInput = request.body

    // Ensure idImg is initialized (multipart form-data may not parse nested objects)
    accountData.idImg = accountData.idImg || { idFront: '', idBack: '', idSelfie: '' };

    if(await AccountService.checkEmailIfExist(accountData.email)){
        response.status(500).send("email already exist")
        return
    }

    // Get uploaded files from multer
    const files = request.files as { [fieldname: string]: { path: string }[] } | undefined;

    // Validate that all 3 ID images are provided
    if (!files?.['idFront']?.[0] || !files?.['idBack']?.[0] || !files?.['idSelfie']?.[0]) {
      response.status(400).send("All 3 ID images (front ID, back ID, selfie with ID) are required");
      return;
    }

    // Upload ID images to Cloudinary and set URLs in idImg
    accountData.idImg.idFront = await uploadToCloudinary(files['idFront'][0].path);
    accountData.idImg.idBack = await uploadToCloudinary(files['idBack'][0].path);
    accountData.idImg.idSelfie = await uploadToCloudinary(files['idSelfie'][0].path);

    const hashedPassword = await bcrypt.hash(accountData.password, 10);
    accountData.password = hashedPassword

    const account = await AccountService.create(accountData)

    response.send({ userId : account._id })
  }

  static getAll = async (request: AuthRequest, response: Response) => {
    try {
      const { status } = request.query;
      const filter = status ? { status } : {};
      const accounts = await AccountService.getAll(filter);
      response.send(accounts);
    } catch (error) {
      response.status(500).send("Failed to fetch accounts");
    }
  }

  static updateStatus = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { status } = request.body;

      if (!['approved', 'rejected'].includes(status)) {
        response.status(400).send("Invalid status. Must be 'approved' or 'rejected'");
        return;
      }

      const account = await AccountService.updateStatus(id, status);
      if (!account) {
        response.status(404).send("Account not found");
        return;
      }

      response.send({ message: `Account ${status} successfully` });
    } catch (error) {
      response.status(500).send("Failed to update account status");
    }
  }

  static resubmitImages = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;

      // Get uploaded files from multer
      const files = request.files as { [fieldname: string]: { path: string }[] } | undefined;

      // Validate that all 3 ID images are provided
      if (!files?.['idFront']?.[0] || !files?.['idBack']?.[0] || !files?.['idSelfie']?.[0]) {
        response.status(400).send("All 3 ID images (front ID, back ID, selfie with ID) are required");
        return;
      }

      // Find existing account
      const existing = await AccountService.get(id);
      if (!existing) {
        response.status(404).send("Account not found");
        return;
      }

      // Upload new ID images to Cloudinary
      const idFront = await uploadToCloudinary(files['idFront'][0].path);
      const idBack = await uploadToCloudinary(files['idBack'][0].path);
      const idSelfie = await uploadToCloudinary(files['idSelfie'][0].path);

      // Update account with new images and set status back to pending
      await AccountService.update(id, {
        idImg: { idFront, idBack, idSelfie },
        status: 'pending',
      });

      response.send({ message: 'Images resubmitted successfully. Status set to pending.' });
    } catch (error) {
      response.status(500).send("Failed to resubmit images");
    }
  }

  static getProfile = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const account = await AccountService.getProfile(id);
      if (!account) {
        response.status(404).send("Account not found");
        return;
      }
      response.send(account);
    } catch (error) {
      response.status(500).send("Failed to fetch profile");
    }
  }

  static addSkill = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { skill, experience, proficiency } = request.body;

      if (!skill || experience === undefined || !proficiency) {
        response.status(400).send("All fields are required: skill, experience, proficiency");
        return;
      }

      const account = await AccountService.addSkill(id, {
        skill,
        experience: Number(experience),
        proficiency,
      });

      if (!account) {
        response.status(404).send("Account not found");
        return;
      }

      response.send(account);
    } catch (error) {
      response.status(500).send("Failed to add skill");
    }
  }

  static removeSkill = async (request: AuthRequest, response: Response) => {
    try {
      const { id, skillId } = request.params;

      const account = await AccountService.removeSkill(id, skillId);

      if (!account) {
        response.status(404).send("Account not found");
        return;
      }

      response.send(account);
    } catch (error) {
      response.status(500).send("Failed to remove skill");
    }
  }

  static uploadProfilePic = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;

      if (!request.file) {
        response.status(400).send("No profile image provided");
        return;
      }

      const account = await AccountService.get(id);
      if (!account) {
        response.status(404).send("Account not found");
        return;
      }

      const profilePicUrl = await uploadToCloudinary(request.file.path);

      const updated = await AccountService.update(id, {
        profile: profilePicUrl,
      });

      response.send(updated);
    } catch (error) {
      response.status(500).send("Failed to upload profile picture");
    }
  }

  static updateInfo = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { name, address, contact } = request.body;

      if (!name && !address && !contact) {
        response.status(400).send("No fields to update");
        return;
      }

      const updateData: Record<string, string> = {};
      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (contact) updateData.contact = contact;

      const account = await AccountService.update(id, updateData);
      if (!account) {
        response.status(404).send("Account not found");
        return;
      }

      response.send(account);
    } catch (error) {
      response.status(500).send("Failed to update profile");
    }
  }

  static changePassword = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { oldPassword, newPassword } = request.body;

      if (!oldPassword || !newPassword) {
        response.status(400).send("Old password and new password are required");
        return;
      }

      if (newPassword.length < 6) {
        response.status(400).send("New password must be at least 6 characters");
        return;
      }

      const account = await AccountService.get(id);
      if (!account) {
        response.status(404).send("Account not found");
        return;
      }

      const isMatch = await bcrypt.compare(oldPassword, account.password);
      if (!isMatch) {
        response.status(400).send("Old password is incorrect");
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await AccountService.update(id, { password: hashedPassword });

      response.send({ message: "Password changed successfully" });
    } catch (error) {
      response.status(500).send("Failed to change password");
    }
  }

  static login = async (request : AuthRequest , response : Response) => {
    const { email, password } = request.body
    const account = await AccountService.checkEmailIfExist(email)

    if(!account){
        response.status(500).send("user not found")
        return
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if(!isMatch){
        response.status(500).send("incorect password")
        return
    }

    const token = jwt.sign({ id: account._id }, secret, { expiresIn: "3d" });

    response.send({account , token});
  }



}
