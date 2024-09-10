/*
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}*/



import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error in applyJob:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } },
                }
            });

        if (!applications) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error("Error in getAppliedJobs:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
/*
//admin dekhege kitna user na apply kia hai
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
                
            }
            
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("Error in getApplicants:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};*/




//new 
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log(`Fetching job details for jobId: ${jobId}`);

        // Fetch the job document by ID
        const job = await Job.findById(jobId)
            .populate({
                path: 'applications',
                populate: {
                    path: 'applicant',
                    select: '-password' // Ensure sensitive fields are excluded
                },
                options: { sort: { createdAt: -1 } } // Optional: sort applications by creation date
            });

        if (!job) {
            console.log('Job not found for the provided jobId.');
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        // Log the job details to see what is being fetched
        console.log('Job details:', job);

        // Check if applications array is populated
        if (!job.applications || job.applications.length === 0) {
            console.log('No applications found for this job.');
        } else {
            console.log(`Found ${job.applications.length} applications for the job.`);

            // Iterate through applications to check if applicants are populated
            job.applications.forEach((application, index) => {
                if (!application.applicant) {
                    console.log(`Application ${index + 1} does not have an applicant populated.`);
                } else {
                    console.log(`Application ${index + 1} has applicant data:`, application.applicant);
                }
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("Error in getApplicants:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        console.log("Received request to update status for application ID:", applicationId);
        console.log("Requested status:", status);

        // Check if status is provided
        if (!status) {
            console.error("Status is missing in the request body.");
            return res.status(400).json({
                message: 'Status is required.',
                success: false
            });
        }

        // Validate status value
        const validStatuses = ['pending', 'accepted', 'rejected'];
        if (!validStatuses.includes(status.toLowerCase())) {
            console.error("Invalid status value provided:", status);
            return res.status(400).json({
                message: 'Invalid status value.',
                success: false
            });
        }

        // Find the application by application ID
        const application = await Application.findById(applicationId);
        console.log("Fetched application:", application);

        if (!application) {
            console.error("No application found with ID:", applicationId);
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();
        console.log("Updated application status:", application);

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error in updateStatus:", error.message || error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
