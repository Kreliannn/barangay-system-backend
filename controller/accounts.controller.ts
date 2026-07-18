import { Response } from "express";
import { AuthRequest } from "../types/request.type";
import { accountInterfaceInput } from "../types/accounts.type";
import { AccountService } from "../services/acccount.service";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { UserActivityService } from "../services/userActivity.service";
import { formattedDate } from "../utils/customFunc";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SystemInfoService } from "../services/systemInfo.service";
import { BusinessService } from "../services/business.service";

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

  static getActivityByResident = async (request: AuthRequest, response: Response) => {
      try {
        const { id } = request.params;
        const activity = await UserActivityService.getByAccount(id);
        response.send(activity);
      } catch (error) {
        response.status(500).send("Failed to fetch activity requests by resident");
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


      await UserActivityService.create({
        accountId : account._id.toString(),
        activity : "Added skills to profile",
        date : formattedDate()
      })

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

      await UserActivityService.create({
        accountId : account._id.toString(),
        activity : "Removed skills to profile",
        date : formattedDate()
      })

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

      await UserActivityService.create({
        accountId : account._id.toString(),
        activity : "Changed Account profile picture",
        date : formattedDate()
      })

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
      const { name, address, contact, gender, dateOfBirth, civilStatus, purok, voterStatus, houseHoldNumber } = request.body;

      if (!name && !address && !contact && !gender && !dateOfBirth && !civilStatus && !purok && !voterStatus && !houseHoldNumber) {
        response.status(400).send("No fields to update");
        return;
      }

      const updateData: Record<string, string> = {};
      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (contact) updateData.contact = contact;
      if (gender) updateData.gender = gender;
      if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
      if (civilStatus) updateData.civilStatus = civilStatus;
      if (purok) updateData.purok = purok;
      if (voterStatus) updateData.voterStatus = voterStatus;
      if (houseHoldNumber) updateData.houseHoldNumber = houseHoldNumber;

      const account = await AccountService.update(id, updateData);
      if (!account) {
        response.status(404).send("Account not found");
        return;
      }

      await UserActivityService.create({
        accountId : account._id.toString(),
        activity : "Update User Info",
        date : formattedDate()
      })

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

       await UserActivityService.create({
        accountId : account._id.toString(),
        activity : "Changed Password",
        date : formattedDate()
      })

      response.send({ message: "Password changed successfully" });
    } catch (error) {
      response.status(500).send("Failed to change password");
    }
  }

  static getResidentsWithSkills = async (_request: AuthRequest, response: Response) => {
    try {
      const residents = await AccountService.getResidentsWithSkills();
      response.send(residents);
    } catch (error) {
      response.status(500).send("Failed to fetch residents");
    }
  }

  static addReview = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { star, skill, message } = request.body;

      if (!star || !skill || !message) {
        response.status(400).send("All fields are required: star, skill, message");
        return;
      }

      if (star < 1 || star > 5) {
        response.status(400).send("Star rating must be between 1 and 5");
        return;
      }

      // Get the logged-in user's info for the review
      const reviewer = request.account;
      if (!reviewer) {
        response.status(401).send("User not authenticated");
        return;
      }

      const reviewerAccount = await AccountService.get(reviewer._id);
      if (!reviewerAccount) {
        response.status(404).send("Reviewer not found");
        return;
      }

      const account = await AccountService.addReview(id, {
        user: reviewerAccount.name,
        userProfile: reviewerAccount.profile || '',
        star: Number(star),
        skill,
        message,
      });

      if (!account) {
        response.status(404).send("Account not found");
        return;
      }


       await UserActivityService.create({
        accountId : account._id.toString(),
        activity : "Place a Review to other Resident",
        date : formattedDate()
      })

      response.send(account);
    } catch (error) {
      response.status(500).send("Failed to add review");
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


  static aiChatBot = async (request: AuthRequest, response: Response) => {
    try {
      const { input, convo } = request.body;

      const systeminfo = await SystemInfoService.getFirst()

      const residentsInfo = await AccountService.getAccountsForAI()

      const businessInfo = await BusinessService.getBusinessForAI()

      console.log(businessInfo)


      const genAI = new GoogleGenerativeAI("AQ.Ab8RN6KC25KNFm1OugVn_iOHeJSN3XLPHObuYqvcnBX-7zhzkA");

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
      const prompt = `


      You are an AI assistant for the Barangay Information System.

       all resdient information and all business information is provided. respond to user question based on the data provided.
       

        If a question is unrelated to the system

        "I'm here to assist with barangay-related questions, including information about barangay services, office hours, announcements, registered residents and their skills, and registered businesses. I can't answer questions outside of these topics."

        Be friendly, concise, and accurate.

            barangayInfo
            ${systeminfo}

            residentsInfo
            ${residentsInfo}

            businessInfo
            ${businessInfo}

            Previous Conversation:
            ${Array.isArray(convo) ? convo.join("\n") : ""}

            User input/user qeustion:
            ${input}
       `;

      const result = await model.generateContent(prompt);
      const aiReply = result.response.text();

      response.send(aiReply)

    } catch (error) {
      console.error(error);

      response.status(500).json({
        success: false,
        message: "Failed to generate response",
      });
    }
  };

  // ── AI Context ──────────────────────────────────────────────────

  static getAiContext = async (_request: AuthRequest, response: Response) => {
    try {
     
      const systemInfo = await SystemInfoService.getFirst();
    
      response.send(systemInfo || { aiContext: "" });
    } catch (error) {
      response.status(500).send("Failed to fetch AI context");
    }
  }

  static upsertAiContext = async (request: AuthRequest, response: Response) => {
    try {
      const { aiContext } = request.body;

      if (!aiContext || !aiContext.trim()) {
        response.status(400).send("AI context is required");
        return;
      }

      const systemInfo = await SystemInfoService.upsert({ aiContext });
      response.send(systemInfo);
    } catch (error) {
      response.status(500).send("Failed to save AI context");
    }
  }

}
