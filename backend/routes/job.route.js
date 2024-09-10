import express from "express";
import { login, logout,register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs,postJob, getAllJobs, getJobById } from "../controllers/job.controller.js";

 
const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);


router.route("/profile/update").post(isAuthenticated,updateProfile);

export default router;
